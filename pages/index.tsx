import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

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

export default Home
