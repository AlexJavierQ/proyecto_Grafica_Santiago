'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileSpreadsheet, Download, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import styles from './page.module.css'

interface ImportResult {
    success: number
    errors: { row: number; error: string; data?: string }[]
    skipped: number
}

export default function ImportProductsPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState<ImportResult | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                toast.error('Por favor selecciona un archivo CSV')
                return
            }
            setFile(selectedFile)
            setResult(null)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
            setFile(droppedFile)
            setResult(null)
        } else {
            toast.error('Por favor arrastra un archivo CSV')
        }
    }

    const handleImport = async () => {
        if (!file) return

        setIsUploading(true)
        setResult(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/admin/products/import', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al importar')
            }

            setResult(data.results)

            if (data.results.success > 0) {
                toast.success(`${data.results.success} productos importados correctamente`)
            }

            if (data.results.errors.length > 0) {
                toast.warning(`${data.results.errors.length} filas con errores`)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsUploading(false)
        }
    }

    const downloadTemplate = () => {
        const header = 'name,sku,description,price,wholesalePrice,stock,minStock,categoryName,images,isActive'
        const example1 = 'Cuaderno Universitario,PAP-001,Cuaderno de 100 hojas cuadriculado,2500,2000,50,10,Papelería,,true'
        const example2 = 'Lápiz HB,PAP-002,Lápiz grafito HB,500,400,200,20,Papelería,,true'
        const example3 = 'Goma de Borrar,PAP-003,Goma blanca suave,300,250,100,15,Papelería,,true'

        const csvContent = `${header}\n${example1}\n${example2}\n${example3}`

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'plantilla_productos.csv'
        link.click()

        toast.success('Plantilla descargada')
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/productos" className={styles.backLink}>
                    <ArrowLeft size={18} />
                    Volver a Productos
                </Link>
                <h1 className={styles.title}>Importar Productos</h1>
                <p className={styles.subtitle}>Carga masiva de productos desde un archivo CSV</p>
            </div>

            <div className={styles.content}>
                {/* Instructions */}
                <div className={styles.instructionsCard}>
                    <h2><FileSpreadsheet size={20} /> Formato del Archivo</h2>
                    <p>El archivo CSV debe tener las siguientes columnas:</p>

                    <div className={styles.columnsGrid}>
                        <div className={styles.columnItem}>
                            <span className={styles.required}>name</span>
                            <small>Nombre del producto</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span className={styles.required}>sku</span>
                            <small>Código único</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span className={styles.required}>price</span>
                            <small>Precio unitario</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span className={styles.required}>stock</span>
                            <small>Cantidad en stock</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span>description</span>
                            <small>Descripción</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span>wholesalePrice</span>
                            <small>Precio mayorista</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span>categoryName</span>
                            <small>Nombre de categoría</small>
                        </div>
                        <div className={styles.columnItem}>
                            <span>isActive</span>
                            <small>true/false</small>
                        </div>
                    </div>

                    <button className={styles.templateBtn} onClick={downloadTemplate}>
                        <Download size={16} />
                        Descargar Plantilla CSV
                    </button>
                </div>

                {/* Upload Area */}
                <div
                    className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${file ? styles.hasFile : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        hidden
                    />

                    {file ? (
                        <div className={styles.fileInfo}>
                            <FileSpreadsheet size={40} />
                            <span className={styles.fileName}>{file.name}</span>
                            <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={40} />
                            <span className={styles.uploadText}>
                                Arrastra tu archivo CSV aquí o haz clic para seleccionar
                            </span>
                            <span className={styles.uploadHint}>Máximo 5MB • Solo archivos .csv</span>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={styles.importBtn}
                        onClick={handleImport}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className={styles.spinning} />
                                Importando...
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                Importar Productos
                            </>
                        )}
                    </button>

                    {file && !isUploading && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => { setFile(null); setResult(null); }}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className={styles.results}>
                        <h3>Resultados de la Importación</h3>

                        <div className={styles.resultStats}>
                            <div className={styles.resultItem + ' ' + styles.success}>
                                <CheckCircle size={24} />
                                <div>
                                    <span className={styles.resultValue}>{result.success}</span>
                                    <span className={styles.resultLabel}>Importados</span>
                                </div>
                            </div>
                            <div className={styles.resultItem + ' ' + styles.error}>
                                <XCircle size={24} />
                                <div>
                                    <span className={styles.resultValue}>{result.errors.length}</span>
                                    <span className={styles.resultLabel}>Errores</span>
                                </div>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className={styles.errorsList}>
                                <h4><AlertCircle size={16} /> Errores encontrados:</h4>
                                <div className={styles.errorsScroll}>
                                    {result.errors.map((err, idx) => (
                                        <div key={idx} className={styles.errorRow}>
                                            <span className={styles.errorRowNum}>Fila {err.row}</span>
                                            <span className={styles.errorMsg}>{err.error}</span>
                                            {err.data && <span className={styles.errorData}>{err.data}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.success > 0 && (
                            <Link href="/admin/productos" className={styles.viewProductsBtn}>
                                Ver Productos Importados
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
