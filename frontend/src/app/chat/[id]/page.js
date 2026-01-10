'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './chat.module.css'

export default function PaginaChat() {
  const roteador = useRouter()
  const params = useParams()
  const documentId = params.id

  const [documento, setDocumento] = useState(null)
  const [pergunta, setPergunta] = useState('')
  const [historico, setHistorico] = useState([])
  const [carregando, setCarregando] = useState(false)
  
  const URL_API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      roteador.replace('/login')
    } 
    if (!documentId) return
    carregarDocumento(documentId)
    carregarHistorico(documentId)
  }, [documentId])

  const carregarDocumento = async () => {
    try {
      const token = localStorage.getItem('token')
      const resposta = await fetch(`${URL_API}/document/${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const dados = await resposta.json()
      setDocumento(dados)
    } catch (erro) {
      console.error('Erro ao carregar documento:', erro)
    }
  }

  const carregarHistorico = async () => {
    try {
      const token = localStorage.getItem('token')
      const resposta = await fetch(`${URL_API}/chat/history/${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const dados = await resposta.json()
      setHistorico(dados)
    } catch (erro) {
      console.error('Erro ao carregar histórico:', erro)
    }
  }

  const aoEnviarPergunta = async (evento) => {
    evento.preventDefault()
    if (!pergunta.trim()) return

    setCarregando(true)

    try {
      const token = localStorage.getItem('token')
      const resposta = await fetch(`${URL_API}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: parseInt(documentId),
          question: pergunta
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message || dados.error || 'Erro ao processar pergunta')
      }

      setHistorico([...historico, {
        question: dados.question,
        answer: dados.answer,
        createdAt: new Date()
      }])

      setPergunta('')

    } catch (erro) {
      alert('Erro: ' + erro.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.containerPrincipal}>
      
      <div className={styles.cabecalho}>
        <div className={styles.conteudoCabecalho}>
          <button
            onClick={() => roteador.push('/upload')}
            className={styles.botaoVoltar}
          >
            ← Voltar
          </button>
          <h1 className={styles.titulo}>Chat com Documento</h1>
          <div></div>
        </div>
      </div>

      <div className={styles.conteudo}>
        
        {/* infos do doc */}
        {documento && (
          <div className={styles.secaoDocumento}>
            <h2 className={styles.tituloDocumento}>{documento.filename}</h2>
            <div className={styles.textoDocumento}>
              {documento.extractedText || 'Nenhum texto extraído'}
            </div>
          </div>
        )}

        {/* Historico de conversas */}
        <div className={styles.secaoHistorico}>
          <h3 className={styles.tituloHistorico}>Histórico de Conversas</h3>
          
          {historico.length === 0 ? (
            <p className={styles.mensagemVazia}>
              Nenhuma pergunta ainda. Faça a primeira!
            </p>
          ) : (
            <div className={styles.listaConversas}>
              {historico.map((conversa, indice) => (
                <div key={indice} className={styles.blocoConversa}>
                  <div className={styles.mensagemUsuario}>
                    <p className={styles.autorMensagem}>Você:</p>
                    <p className={styles.textoMensagem}>{conversa.question}</p>
                  </div>
                  <div className={styles.mensagemIA}>
                    <p className={styles.autorIA}>IA:</p>
                    <p className={styles.textoIA}>{conversa.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* form  de pergunta*/}
        <div className={styles.secaoFormulario}>
          <form onSubmit={aoEnviarPergunta}>
            <label className={styles.labelFormulario}>
              Fazer Pergunta:
            </label>
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Ex: Qual o valor total? Quem é o fornecedor?"
              className={styles.textareaFormulario}
              rows="3"
              disabled={carregando}
            />
            <button
              type="submit"
              disabled={carregando || !pergunta.trim()}
              className="botao botaoPrimario"
              style={{ width: '100%' }}
            >
              {carregando ? 'Processando...' : 'Enviar Pergunta'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}