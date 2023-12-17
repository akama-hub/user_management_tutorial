# UserManagementTutorial

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## スタンドアローンコンポーネントを使用する
[参考](https://qiita.com/BRSF/items/44bda3ac30043c2fce6f)

### 必要なモジュールだけを集約したライブラリの作成

スタンドアロンコンポーネントを用いれば、CommonModuleが標準実装され、このCommonModuleはngModule、FormsModule、BrowserModuleといったコンポーネント作成に最低限必要なモジュールを一通りスートにしてくれている

しかし、CommonModule以外にもRouterModuleやFormsModuleに代わるReactiveFormsModuleは場合によっては必須になるので、必要なモジュールだけを集約したライブラリを作成する。

'''
ng g module shared --module=app
'''

--module=appを書くとapp.module.tsにsharedモジュールの設定を勝手に追加してくれる

'''
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  //アプリケーション起動に必要なモジュール
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  //外部で制御させたいモジュール
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
'''

### ルーティング制御を分離、簡略化

main.tsでルーティング情報を制御させることができ、独立したファイル(routes.ts)で管理することもできる。

例えば、routes.tsに分離させるなら、

```
ng g class routes
```

'''
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details',
  },
];

export default routeConfig;
'''

上記をmain.tsで読み込む
```
import { enableProdMode,importProvidersFrom} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule,Routes } from '@angular/router';
import { environment } from './environments/environment'; //apiキーの設定設定ファイル
import { routeConfig } from './app/routes' //ルーティングの設定ファイル
if (environment.production) {
  enableProdMode();
}

// StandaloneのBootstrap
bootstrapApplication(AppComponent,{
   providers:[importProvidersFrom(RouterModule.forRoot(routeConfig))]
}).catch(err => console.error(err));
```

# Angular × Supabase  Web Application

AngularとSupabase間はRxjsを使ってデータの受け渡しをする

# Setup

## Supabase
1. Projectの作成
2. ダッシュボードのSQL Edhiter の Quick starts から User Management Starter を選択してAPI管理テーブルを作成する
3. 実行（RUN）をクリック

## Angular
1. nodebrew を使用してnode.js のバージョン管理

```
nodebrew use 18.13.0
```

2. Angular アプリケーションの作成

```
ng new user_management_tutorial
```

3. supabase javascirpt をインストール

```
npm install @supabase/supabase-js
```

4. 環境変数を environment.ts ファイルに保存
API URL とanonキー を記述

```
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
}
```

5. supabase service の作成と supabase client の初期化

```
ng generate service services/supabase
```

```
import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }
}
```

6. ログインコンポーネントの作成
ログインとサインアップを管理するためのセットアップ
今回はマジックリンクを使用

```
ng g c auth
```

```
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SupabaseService } from '../services/supabase.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loading = false

  signInForm = this.formBuilder.group({
    email: '',
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }
}
```

7. アカウント編集ページの作成

'''
ng g c account
'''

```
import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { Profile, SupabaseService } from '../services/supabase.service'

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  loading = false
  profile!: Profile

  @Input()
  session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  })

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    await this.getProfile()

    const { username, website, avatar_url } = this.profile
    this.updateProfileForm.patchValue({
      username,
      website,
      avatar_url,
    })
  }

  async getProfile() {
    try {
      this.loading = true
      const { user } = this.session
      const { data: profile, error, status } = await this.supabase.profile(user)

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const { user } = this.session

      const username = this.updateProfileForm.value.username as string
      const website = this.updateProfileForm.value.website as string
      const avatar_url = this.updateProfileForm.value.avatar_url as string

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        avatar_url,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async signOut() {
    await this.supabase.signOut()
  }
}

```

8. アバター編集機能の作成

```
ng g c avatar
```

9. ストレージ管理
追加でデータベースをアップロードしていく（プロフィール画像の更新など）と古いデータも蓄積していく。
ダッシュボードのデータベースのExtensions から```http```を有効にする

そして、以下の3つのSQL関数をSQLエディタで定義する 

APIをつかってストレージオブジェクトを削除する
```
create or replace function delete_storage_object(bucket text, object text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
declare
  project_url text := '<YOURPROJECTURL>';
  service_role_key text := '<YOURSERVICEROLEKEY>'; --  full access needed
  url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

create or replace function delete_avatar(avatar_url text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

```

プロフィールが更新もしくは削除されたことをトリガーとして古いアバターを削除する
```
create or replace function delete_old_avatar()
returns trigger
language 'plpgsql'
security definer
as $$
declare
  status int;
  content text;
  avatar_name text;
begin
  if coalesce(old.avatar_url, '') <> ''
      and (tg_op = 'DELETE' or (old.avatar_url <> coalesce(new.avatar_url, ''))) then
    -- extract avatar name
    avatar_name := old.avatar_url;
    select
      into status, content
      result.status, result.content
      from public.delete_avatar(avatar_name) as result;
    if status <> 200 then
      raise warning 'Could not delete avatar: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger before_profile_changes
  before update of avatar_url or delete on public.profiles
  for each row execute function public.delete_old_avatar();
```

ユーザが削除されたときに、ユーザデータを削除する前にまずアバター画像を削除する
```
create or replace function delete_old_profile()
returns trigger
language 'plpgsql'
security definer
as $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

create trigger before_delete_user
  before delete on auth.users
  for each row execute function public.delete_old_profile();

```

## 参考
[Angularは14から使うべき８つの理由（始めよう、スタンドアロンコンポーネント）](https://qiita.com/BRSF/items/44bda3ac30043c2fce6f)

[Supabase Angular authentication with RxJS Observables](https://gist.github.com/kylerummens/c2ec82e65d137f3220748ff0dee76c3f)

[Supabase を使用した Angular アプリケーションへの認証](https://dev.to/rodrigokamada/authentication-using-the-supabase-to-an-angular-application-2jek)

[supabase 公式 Doc](https://supabase.com/docs/guides/getting-started/tutorials/with-angular)