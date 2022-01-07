import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/Home.module.css'

type Result = {}

const Home: NextPage<Result> = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { sigIn } = useAuth();

  const set = <T extends unknown>(set: (value: T) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      set(event.target.value as T)
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const data = {
      email,
      password
    }
    sigIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={set(setEmail)} />
      <input type="password" value={password} onChange={set(setPassword)} />
      <button type='submit'>
        Entrar
      </button>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<Result> = async (ctx) => {

  const cookies = parseCookies(ctx);

  if (cookies["nextauth.token"]) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
}

export default Home
