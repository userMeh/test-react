import Link from 'next/link';

export const Header = () => {
  return (
    <nav id='navbar' className='sticky top-0 z-10 bg-[#0e2bcf] shadow-md'>
      <div className='container-fluid my-4'>
        <Link href='/'>Home</Link>
        <Link href='/auth/login'>Se connecter</Link>
        <Link href='/auth/register'>S'inscrire</Link>
      </div>
    </nav>
  );
};
