'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3, TrendingUp, PieChart, Package, Download, Calendar,
    DollarSign, Users, ShoppingCart, X, FileText, ArrowUpRight,
    ArrowDownRight, FileSpreadsheet, Printer, Clock, Eye, CheckCircle,
    AlertCircle, Loader2
} from 'lucide-react'
import styles from './page.module.css'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart as RePieChart, Pie, Cell, Area, AreaChart, Legend
} from 'recharts'
import { toast } from 'sonner'

const COLORS = ['#FFD700', '#00C49F', '#FF6B6B', '#4ECDC4', '#8884d8', '#82ca9d', '#ffc658']

interface ModalData {
    type: string
    title: string
    data: any[]
    visible: boolean
}

export default function ReportsPage() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dateRange, setDateRange] = useState('30d')
    const [selectedReport, setSelectedReport] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [modal, setModal] = useState<ModalData>({ type: '', title: '', data: [], visible: false })

    const reportTypes = [
        {
            id: 'ventas',
            label: 'Reporte de Ventas',
            icon: TrendingUp,
            description: 'Ingresos, órdenes y evolución de ventas',
            color: '#22c55e',
            formats: ['CSV', 'PDF']
        },
        {
            id: 'productos',
            label: 'Reporte de Productos',
            icon: Package,
            description: 'Inventario, productos más vendidos y stock',
            color: '#3b82f6',
            formats: ['CSV', 'PDF']
        },
        {
            id: 'clientes',
            label: 'Reporte de Clientes',
            icon: Users,
            description: 'Nuevos registros, clientes frecuentes y mayoristas',
            color: '#a855f7',
            formats: ['CSV', 'PDF']
        },
        {
            id: 'ordenes',
            label: 'Reporte de Órdenes',
            icon: ShoppingCart,
            description: 'Estado de pedidos, tiempos de entrega',
            color: '#f97316',
            formats: ['CSV', 'PDF']
        },
        {
            id: 'financiero',
            label: 'Reporte Financiero',
            icon: DollarSign,
            description: 'Balance, márgenes y rentabilidad',
            color: '#eab308',
            formats: ['CSV', 'PDF', 'Excel']
        },
        {
            id: 'general',
            label: 'Reporte General',
            icon: BarChart3,
            description: 'Resumen ejecutivo de todas las áreas',
            color: '#06b6d4',
            formats: ['PDF']
        },
    ]

    const dateRanges = [
        { value: '7d', label: 'Últimos 7 días' },
        { value: '30d', label: 'Últimos 30 días' },
        { value: '90d', label: 'Últimos 3 meses' },
        { value: '180d', label: 'Últimos 6 meses' },
        { value: '365d', label: 'Último año' },
        { value: 'custom', label: 'Personalizado' },
    ]

    useEffect(() => {
        fetchReports()
    }, [dateRange])

    const fetchReports = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/admin/reports?range=${dateRange}`)
            const result = await res.json()
            setData(result)
        } catch (error) {
            console.error('Error fetching reports:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const generateReport = async (reportId: string, format: string) => {
        setIsGenerating(true)
        setSelectedReport(reportId)

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (!data) {
            toast.error('No hay datos para generar el reporte')
            setIsGenerating(false)
            setSelectedReport(null)
            return
        }

        let csvContent = ''
        let filename = ''

        switch (reportId) {
            case 'ventas':
                csvContent = 'Fecha,Ingresos,Órdenes\n'
                data.salesByDay?.forEach((item: any) => {
                    csvContent += `${item.createdAt},${item._sum.total || 0},${item._count?.id || 0}\n`
                })
                filename = `reporte_ventas_${dateRange}`
                break
            case 'productos':
                csvContent = 'Producto,SKU,Cantidad Vendida,Ingresos Generados\n'
                data.topProducts?.forEach((p: any) => {
                    csvContent += `"${p.name}","${p.sku || 'N/A'}",${p.quantity},${p.revenue}\n`
                })
                filename = `reporte_productos_${dateRange}`
                break
            case 'clientes':
                csvContent = 'Cliente,Email,Total Órdenes,Total Gastado\n'
                data.topCustomers?.forEach((c: any) => {
                    csvContent += `"${c.name}",${c.email},${c.orderCount || 0},${c.totalSpent || 0}\n`
                })
                filename = `reporte_clientes_${dateRange}`
                break
            case 'ordenes':
                csvContent = 'Número Orden,Cliente,Fecha,Estado,Total\n'
                data.recentOrders?.forEach((o: any) => {
                    csvContent += `${o.orderNumber},"${o.userName}",${o.createdAt},${o.status},${o.total}\n`
                })
                filename = `reporte_ordenes_${dateRange}`
                break
            case 'financiero':
                const totalRevenue = data.salesByDay?.reduce((acc: number, item: any) => acc + (item._sum.total || 0), 0) || 0
                csvContent = 'Métrica,Valor\n'
                csvContent += `Ingresos Totales,${totalRevenue}\n`
                csvContent += `Total Órdenes,${data.totalOrders || 0}\n`
                csvContent += `Ticket Promedio,${data.totalOrders > 0 ? (totalRevenue / data.totalOrders).toFixed(2) : 0}\n`
                csvContent += `Nuevos Clientes,${data.newUsers || 0}\n`
                filename = `reporte_financiero_${dateRange}`
                break
            default:
                csvContent = 'Módulo,Descripción,Valor\n'
                csvContent += `Ingresos,Total del período,${data.salesByDay?.reduce((acc: number, item: any) => acc + (item._sum.total || 0), 0) || 0}\n`
                csvContent += `Órdenes,Cantidad total,${data.totalOrders || 0}\n`
                csvContent += `Clientes,Nuevos registros,${data.newUsers || 0}\n`
                filename = `reporte_general_${dateRange}`
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${filename}.csv`
        link.click()

        toast.success(`Reporte generado exitosamente`, {
            description: `${filename}.csv descargado`
        })

        setIsGenerating(false)
        setSelectedReport(null)
    }

    const openModal = (type: string, title: string, chartData: any[]) => {
        setModal({ type, title, data: chartData, visible: true })
    }

    const closeModal = () => {
        setModal({ ...modal, visible: false })
    }

    // Format data
    const salesData = data?.salesByDay?.map((item: any) => ({
        name: new Date(item.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }),
        total: item._sum.total || 0,
    })) || []

    const totalRevenue = salesData.reduce((acc: number, item: any) => acc + item.total, 0)
    const totalOrders = data?.totalOrders || 0
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const newUsers = data?.newUsers || 0

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1 className={styles.title}>Centro de Reportes</h1>
                        <p className={styles.subtitle}>Genera y descarga reportes detallados de tu negocio</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
                {/* Left Side - Report Generation */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <h2><FileSpreadsheet size={20} /> Generar Reporte</h2>
                        <p>Selecciona el tipo de reporte y el período</p>
                    </div>

                    {/* Date Range Selector */}
                    <div className={styles.dateSection}>
                        <label className={styles.sectionLabel}>
                            <Calendar size={16} />
                            Período del Reporte
                        </label>
                        <div className={styles.dateOptions}>
                            {dateRanges.slice(0, 5).map(range => (
                                <button
                                    key={range.value}
                                    className={`${styles.dateOption} ${dateRange === range.value ? styles.active : ''}`}
                                    onClick={() => setDateRange(range.value)}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Report Types */}
                    <div className={styles.reportTypesSection}>
                        <label className={styles.sectionLabel}>
                            <BarChart3 size={16} />
                            Tipo de Reporte
                        </label>
                        <div className={styles.reportTypesList}>
                            {reportTypes.map(report => (
                                <div
                                    key={report.id}
                                    className={styles.reportTypeCard}
                                    style={{ '--accent-color': report.color } as React.CSSProperties}
                                >
                                    <div className={styles.reportTypeIcon} style={{ background: `${report.color}20`, color: report.color }}>
                                        <report.icon size={24} />
                                    </div>
                                    <div className={styles.reportTypeInfo}>
                                        <h3>{report.label}</h3>
                                        <p>{report.description}</p>
                                    </div>
                                    <div className={styles.reportTypeActions}>
                                        {report.formats.map(format => (
                                            <button
                                                key={format}
                                                className={styles.formatBtn}
                                                onClick={() => generateReport(report.id, format)}
                                                disabled={isGenerating}
                                            >
                                                {isGenerating && selectedReport === report.id ? (
                                                    <Loader2 size={14} className={styles.spin} />
                                                ) : (
                                                    <Download size={14} />
                                                )}
                                                {format}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Preview & Stats */}
                <div className={styles.rightPanel}>
                    {/* Quick Stats */}
                    <div className={styles.quickStats}>
                        <h3>Vista Previa - {dateRanges.find(d => d.value === dateRange)?.label}</h3>

                        {isLoading ? (
                            <div className={styles.loadingPreview}>
                                <Loader2 size={24} className={styles.spin} />
                                <span>Cargando datos...</span>
                            </div>
                        ) : (
                            <>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statBox}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                                            <DollarSign size={20} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statValue}>${totalRevenue.toLocaleString('es-EC', { minimumFractionDigits: 2 })}</span>
                                            <span className={styles.statLabel}>Ingresos</span>
                                        </div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                                            <ShoppingCart size={20} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statValue}>{totalOrders}</span>
                                            <span className={styles.statLabel}>Órdenes</span>
                                        </div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                                            <TrendingUp size={20} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statValue}>${avgOrderValue.toFixed(2)}</span>
                                            <span className={styles.statLabel}>Ticket Prom.</span>
                                        </div>
                                    </div>
                                    <div className={styles.statBox}>
                                        <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                                            <Users size={20} />
                                        </div>
                                        <div className={styles.statInfo}>
                                            <span className={styles.statValue}>{newUsers}</span>
                                            <span className={styles.statLabel}>Nuevos Clientes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Chart */}
                                <div className={styles.miniChart} onClick={() => openModal('sales', 'Evolución de Ventas', salesData)}>
                                    <div className={styles.miniChartHeader}>
                                        <span>Evolución de Ventas</span>
                                        <Eye size={14} />
                                    </div>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <AreaChart data={salesData}>
                                            <defs>
                                                <linearGradient id="colorMini" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="total" stroke="#FFD700" fill="url(#colorMini)" strokeWidth={2} />
                                            <Tooltip
                                                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.8rem' }}
                                                formatter={(value: any) => [`$${value.toLocaleString('es-EC')}`, '']}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Top Products Preview */}
                                <div className={styles.topProductsPreview}>
                                    <h4><Package size={16} /> Top 3 Productos</h4>
                                    {(data?.topProducts || []).slice(0, 3).map((p: any, i: number) => (
                                        <div key={i} className={styles.topProductItem}>
                                            <span className={styles.topProductRank}>#{i + 1}</span>
                                            <span className={styles.topProductName}>{p.name}</span>
                                            <span className={styles.topProductValue}>${p.revenue.toLocaleString('es-EC')}</span>
                                        </div>
                                    ))}
                                    {(!data?.topProducts || data?.topProducts.length === 0) && (
                                        <p className={styles.noData}>Sin datos para este período</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Recent Reports */}
                    <div className={styles.recentReports}>
                        <h3><Clock size={18} /> Reportes Recientes</h3>
                        <div className={styles.recentList}>
                            <div className={styles.recentItem}>
                                <CheckCircle size={16} className={styles.recentSuccess} />
                                <div className={styles.recentInfo}>
                                    <span>reporte_ventas_30d.csv</span>
                                    <small>Hace 2 horas</small>
                                </div>
                                <Download size={14} />
                            </div>
                            <div className={styles.recentItem}>
                                <CheckCircle size={16} className={styles.recentSuccess} />
                                <div className={styles.recentInfo}>
                                    <span>reporte_productos_7d.csv</span>
                                    <small>Ayer</small>
                                </div>
                                <Download size={14} />
                            </div>
                            <div className={styles.recentItem}>
                                <CheckCircle size={16} className={styles.recentSuccess} />
                                <div className={styles.recentInfo}>
                                    <span>reporte_general_90d.csv</span>
                                    <small>Hace 3 días</small>
                                </div>
                                <Download size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modal.visible && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{modal.title}</h2>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={modal.data}>
                                    <defs>
                                        <linearGradient id="colorModal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                                    <YAxis stroke="rgba(255,255,255,0.4)" tickFormatter={(v) => `$${v}`} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        formatter={(value: any) => [`$${value.toLocaleString('es-EC')}`, 'Ingresos']}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#FFD700" fill="url(#colorModal)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>

                            <div className={styles.modalTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th style={{ textAlign: 'right' }}>Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modal.data.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td>{item.name}</td>
                                                <td style={{ textAlign: 'right', color: '#22c55e', fontWeight: 600 }}>
                                                    ${item.total.toLocaleString('es-EC')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.modalExportBtn} onClick={() => generateReport('ventas', 'CSV')}>
                                <Download size={18} />
                                Descargar CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
