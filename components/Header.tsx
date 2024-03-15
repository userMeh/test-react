import Link from 'next/link';

interface HeaderProps {
  token: string | undefined;
}

export const Header = (props: HeaderProps) => {
  return (
    <nav id='navbar' className='sticky top-0 z-10 bg-[#0e2bcf] shadow-md'>
      <div className='container-fluid my-4'>
        <Link href='/'>Home</Link>
        {props.token === undefined && (
          <>
            <Link href='/auth/login'>Se connecter</Link>
            <Link href='/auth/register'>S'inscrire</Link>
          </>
        )}
        {props.token !== undefined && (
          <>
            <Link href='/auth/logout'>Se déconnecter</Link>
          </>
        )}
      </div>
    </nav>
  );
};
