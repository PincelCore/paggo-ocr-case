'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './upload.module.css'

export default function PaginaUpload() {
  const roteador = useRouter()
  const [arquivo, setArquivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [documentos, setDocumentos] = useState([])
  
  const URL_API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      roteador.push('/login')
      return
    }
    carregarDocumentos()
  }, [roteador])

  const carregarDocumentos = async () => {
    try {
      const token = localStorage.getItem('token')
      const resposta = await fetch(`${URL_API}/document/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const dados = await resposta.json()
      setDocumentos(dados)
    } catch (erro) {
      console.error('Erro ao carregar documentos:', erro)
    }
  }

  const aoMudarArquivo = (evento) => {
    const arquivoSelecionado = evento.target.files[0]
    if (arquivoSelecionado) {
      setArquivo(arquivoSelecionado)
      
      const leitor = new FileReader()
      leitor.onloadend = () => setPreview(leitor.result)
      leitor.readAsDataURL(arquivoSelecionado)
    }
  }

  const aoFazerUpload = async () => {
    if (!arquivo) return

    setCarregando(true)
    setResultado(null)

    try {
      const token = localStorage.getItem('token')
      const dadosFormulario = new FormData()
      dadosFormulario.append('file', arquivo)

      const resposta = await fetch(`${URL_API}/document/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: dadosFormulario
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.message)
      }

      setResultado(dados)
      carregarDocumentos()
      
    } catch (erro) {
      alert('Erro: ' + erro.message)
    } finally {
      setCarregando(false)
    }
  }

  const aoSair = () => {
    localStorage.clear()
    roteador.push('/login')
  }

  const aoClicarDocumento = (idDocumento) => {
    roteador.push(`/chat/${idDocumento}`)
  }

  return (
    <div className={styles.containerPrincipal}>
      
      <div className={styles.cabecalho}>
        <div className={styles.conteudoCabecalho}>
          <h1 className={styles.titulo}>Paggo OCR</h1>
          <button onClick={aoSair} className={styles.botaoSair}>
            Sair
          </button>
        </div>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.grade}>
          
          {/*seção uploads */}
          <div className={styles.secao}>
            <h2 className={styles.tituloSecao}>Upload de Invoice</h2>

            <div className={styles.campoArquivo}>
              <label className={styles.labelArquivo}>
                Selecione a imagem
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={aoMudarArquivo}
                className={styles.inputArquivo}
              />
            </div>

            {preview && (
              <div className={styles.areaPreview}>
                <p className={styles.labelPreview}>Preview:</p>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className={styles.imagemPreview}
                />
              </div>
            )}

            <button
              onClick={aoFazerUpload}
              disabled={!arquivo || carregando}
              className="botao botaoPrimario"
              style={{ width: '100%' }}
            >
              {carregando ? 'Processando...' : 'Fazer Upload e Extrair Texto'}
            </button>

            {resultado && (
              <div className={styles.resultado}>
                <h3 className={styles.tituloResultado}>✅ Sucesso!</h3>
                <p className={styles.infoResultado}>
                  Texto extraído ({resultado.ocr?.textLength} caracteres)
                </p>
                <div className={styles.textoExtraido}>
                  {resultado.ocr?.preview || 'Nenhum texto detectado'}
                </div>
                <button
                  onClick={() => aoClicarDocumento(resultado.document.id)}
                  className="botao botaoPrimario"
                  style={{ width: '100%' }}
                >
                  Fazer Perguntas sobre este Documento
                </button>
              </div>
            )}
          </div>

          {/* parte dos docs */}
          <div className={styles.secao}>
            <h2 className={styles.tituloSecao}>Meus Documentos</h2>

            {documentos.length === 0 ? (
              <p className={styles.mensagemVazia}>
                Nenhum documento ainda. Faça o primeiro upload!
              </p>
            ) : (
              <div className={styles.listaDocumentos}>
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className={styles.itemDocumento}
                    onClick={() => aoClicarDocumento(doc.id)}
                  >
                    <div className={styles.conteudoItem}>
                      <div className={styles.infoItem}>
                        <p className={styles.nomeArquivo}>{doc.filename}</p>
                        <p className={styles.dataArquivo}>
                          {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className={styles.indicadorLink}>Ver →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}