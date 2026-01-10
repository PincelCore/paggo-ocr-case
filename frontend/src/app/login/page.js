'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function PaginaLogin() {
  const roteador = useRouter()
  const [ehRegistro, setEhRegistro] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')

  const [dadosFormulario, setDadosFormulario] = useState({
    email: '',
    senha: '',
    nome: ''
  })

  const URL_API = process.env.NEXT_PUBLIC_API_URL

  const aoEnviarFormulario = async (evento) => {
    evento.preventDefault()
    setMensagemErro('')
    setCarregando(true)

    try {
      const endpoint = ehRegistro ? '/auth/registrar' : '/auth/login'
      const corpo = {
        email: dadosFormulario.email,
        password: dadosFormulario.senha
      }

      if (ehRegistro) {
        corpo.name = dadosFormulario.nome
      }

      const resposta = await fetch(`${URL_API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao autenticar')
      }

      localStorage.setItem('token', dados.token)
      localStorage.setItem('usuario', JSON.stringify(dados.user))
      roteador.push('/upload')

    } catch (erro) {
      setMensagemErro(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  const aoMudarCampo = (campo, valor) => {
    setDadosFormulario({ ...dadosFormulario, [campo]: valor })
  }

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.cartaoLogin}>
        
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Paggo OCR</h1>
          <p className={styles.subtitulo}>
            {ehRegistro ? 'Criar nova conta' : 'Entre na sua conta'}
          </p>
        </div>

        {mensagemErro && (
          <div className={styles.alerta}>
            {mensagemErro}
          </div>
        )}

        <form onSubmit={aoEnviarFormulario} className={styles.formulario}>
          
          {ehRegistro && (
            <div className={styles.campoFormulario}>
              <label className={styles.label}>Nome</label>
              <input
                type="text"
                value={dadosFormulario.nome}
                onChange={(e) => aoMudarCampo('nome', e.target.value)}
                className="input"
                required={ehRegistro}
              />
            </div>
          )}

          <div className={styles.campoFormulario}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={dadosFormulario.email}
              onChange={(e) => aoMudarCampo('email', e.target.value)}
              className="input"
              required
            />
          </div>

          <div className={styles.campoFormulario}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              value={dadosFormulario.senha}
              onChange={(e) => aoMudarCampo('senha', e.target.value)}
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="botao botaoPrimario"
            style={{ width: '100%' }}
          >
            {carregando ? 'Carregando...' : (ehRegistro ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <div className={styles.rodape}>
          <button
            onClick={() => {
              setEhRegistro(!ehRegistro)
              setMensagemErro('')
            }}
            className={styles.linkAlternar}
          >
            {ehRegistro ? 'Já tem conta? Entrar' : 'Criar nova conta'}
          </button>
        </div>

      </div>
    </div>
  )
}