import Router from 'next/router';
import Cookies from 'js-cookie';

export default function Logout() {
  Cookies.remove('token');
  Router.push('/');
}
