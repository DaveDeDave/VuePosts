import { createRouter, createWebHistory } from 'vue-router';

import Home from './pages/Home.vue';
import Dashboard from './pages/Dashboard.vue';
import Posts from './pages/Posts.vue';
import About from './pages/About.vue';
import NotFound from './pages/NotFound.vue';

import EditAccount from './pages/EditAccount.vue';
import WritePost from './pages/WritePost.vue';
import User from './pages/User.vue';
import PostView from './pages/PostView.vue';

const routes = [
  { path: '/', component: Home, meta: { title: 'VueJS App' } },
  { path: '/dashboard', component: Dashboard, meta: { title: 'VueJS App | Dashboard', authRequired: true } },
  { path: '/dashboard/edit', component: EditAccount, props: true, meta: { title: 'VueJS App | Edit Account', authRequired: true } },
  { path: '/dashboard/write', component: WritePost, meta: { title: 'VueJS App | New Post', authRequired: true } },
  { path: '/user/:username', component: User, meta: { title: 'VueJS App | User' } },
  { path: '/posts', component: Posts, meta: { title: 'VueJS App | Posts' } },
  { path: '/post/:id', component: PostView, meta: { title: 'VueJS App | Post' } },
  { path: '/about', component: About, meta: { title: 'VueJS App | About' } },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound, meta: { title: 'VueJS App | Not Found' } },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes,
  scrollBehavior(to, from) {
    return new Promise((resolve, reject) => {
      if(to.hash) {
        if(from.path != to.path) {
          setTimeout(() => {
            resolve({el: to.hash});
          }, 500);
        } else {
          resolve({el: to.hash});
        }
      } else {
        resolve();
      }
    });
  }
});

router.beforeEach((to) => {
  document.title = to.meta.title;
  let logged = document.cookie ? document.cookie.split('; ').find(c => c.split('=')[0] == 'au') != undefined : false;

  if(to.meta.authRequired && !logged) {
    return { path: '/' };
  } else if(to.path == '/' && logged) {
    return { path: '/dashboard' };
  }
});

export { router };