'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro'
import { LineChart } from '@mui/x-charts'
import { format } from 'date-fns'
import { getAllStocks } from '../../services/stockService'
import type { StockData } from '../../services/types'
import { LicenseInfo } from '@mui/x-license'
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE || '')

const StockDashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // had to change the name for some urls as they are displayed differently in TradingView
  const logoNameMap: Record<string, string> = {
    MSFT: 'microsoft',
    GOOGL: 'alphabet',
    META: 'meta-platforms',
    NVDA: 'nvidia',
    TSLA: 'tesla',
    NFLX: 'netflix',
    CSCO: 'cisco',
    INTC: 'intel',
    ORCL: 'oracle',
    IBM: 'international-bus-mach',
    SAP: 'sap',
    AAPL: 'apple',
    AMZN: 'amazon',
    ELF: 'e-l-f-beauty',
    HPQ: 'hp',
    CRM: 'salesforce',
    BA: 'boeing',
    BBY: 'best-buy',
    VEEV: 'veeva-systems',
  }

  const getLogoUrl = (symbol: string) => {
    const logoName = logoNameMap[symbol] || symbol.toLowerCase()
    return `https://s3-symbol-logo.tradingview.com/${logoName}--big.svg`
  }

  useEffect(() => {
    const updateStocks = () => {
      try {
        const updatedStocks = getAllStocks()
        setStocks(updatedStocks)
      } catch {
        setError('Failed to update stock data')
      }
    }
    updateStocks()
    setLoading(false)
    const interval = setInterval(updateStocks, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedStock && stocks.length > 0) {
      const updatedSelectedStock = stocks.find(
        (s) => s.symbol === selectedStock.symbol
      )
      if (updatedSelectedStock) {
        setSelectedStock(updatedSelectedStock)
      }
    }
  }, [stocks, selectedStock])

  const columns: GridColDef[] = [
    {
      field: 'symbol',
      headerName: 'Symbol',
      flex: 0,
      width: 120,
      renderCell: (params: GridRenderCellParams<StockData>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={getLogoUrl(params.value)}
            alt={`${params.row.name} logo`}
            sx={{
              width: 24,
              height: 24,
              objectFit: 'contain',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Company',
      flex: 1,
      maxWidth: 350,
      hideable: true,
    },
    {
      field: 'trend',
      headerName: 'Trend',
      flex: 1,
      maxWidth: 200,
      renderCell: (params: GridRenderCellParams<StockData>) => {
        const history = params.row.history
        const prediction = params.row.prediction || []

        const historicalData = history.map((h: { price: number }) => h.price)
        const predictionData = prediction.map((p: { price: number }) => p.price)

        const firstPrice = historicalData[0]
        const lastPrice = historicalData[historicalData.length - 1]
        const isTrendUp = lastPrice > firstPrice

        const color = isTrendUp ? '#2e7d32' : '#d32f2f'
        const predictionColor = isTrendUp ? '#ACDEC8' : '#FDBDBE' // jade and ruby

        return (
          <Box sx={{ width: '100%', height: 40 }}>
            <LineChart
              series={[
                {
                  type: 'line',
                  data: historicalData,
                  color: color,
                  area: false,
                  showMark: false,
                },
                {
                  type: 'line',
                  data: predictionData,
                  color: predictionColor,
                  area: false,
                  showMark: false,
                },
              ]}
              height={60}
              hideLegend={true} // trying to remove the legend but it's not working
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              xAxis={[
                {
                  scaleType: 'linear',
                  data: Array.from(
                    { length: historicalData.length },
                    (_, i) => i
                  ),
                  disableTicks: true,
                  disableLine: true,
                  tickSize: 0,
                  tickLabelStyle: { display: 'none' },
                },
              ]}
              yAxis={[
                {
                  min: Math.min(...historicalData, ...predictionData) * 0.99,
                  max: Math.max(...historicalData, ...predictionData) * 1.01,
                  disableTicks: true,
                  disableLine: true,
                  tickSize: 0,
                  tickLabelStyle: { display: 'none' },
                },
              ]}
            />
          </Box>
        )
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<StockData>) => (
        <Typography
          sx={{
            fontSize: '0.875rem',
            backgroundColor:
              params.row.change >= 0
                ? 'rgba(46, 125, 50, 0.10)' // if upwards, green
                : 'rgba(211, 47, 47, 0.10)', // if downwards, red
            color: 'primary.secondary',
            px: 1,
            py: 0.5,
            borderRadius: 3,
          }}
        >
          ${params.value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'change',
      headerName: 'Change',
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<StockData>) => (
        <Typography
          sx={{
            color: params.value >= 0 ? 'success.main' : 'error.main',
            fontSize: '0.875rem',
          }}
        >
          {params.value >= 0 ? '+' : ''}
          {params.value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'changePercent',
      headerName: '% Change',
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<StockData>) => (
        <Typography
          sx={{
            color: params.value >= 0 ? 'success.main' : 'error.main',
            fontSize: '0.875rem',
          }}
        >
          {params.value >= 0 ? '+' : ''}
          {params.value.toFixed(2)}%
        </Typography>
      ),
    },
    {
      field: 'volume',
      headerName: 'Volume',
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams<StockData>) => (
        <Typography sx={{ fontSize: '0.875rem' }}>
          {params.value.toLocaleString()}
        </Typography>
      ),
    },
  ]

  if (loading || stocks.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Stock Dashboard
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          flex: 1,
          m: { xs: 2, sm: 3, md: 5 },
          p: { xs: 2, sm: 3, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: 'none',
        }}
      >
        <DataGridPro
          rows={stocks}
          columns={columns}
          onRowClick={(params) => setSelectedStock(params.row)}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              outline: 'none',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-row': {
              minHeight: '52px !important',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'grey.100',
            },
            '& .MuiDataGrid-columnHeaders': {
              minHeight: '52px !important',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'grey.100',
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
            '& [data-field="name"]': {
              display: { xs: 'none', sm: 'flex' },
            },
            '& [data-field="name"] .MuiDataGrid-columnHeader': {
              display: { xs: 'none', sm: 'flex' },
            },
            '& [data-field="trend"]': {
              display: { xs: 'none', sm: 'flex' },
            },
            '& [data-field="trend"] .MuiDataGrid-columnHeader': {
              display: { xs: 'none', sm: 'flex' },
            },
          }}
          getRowHeight={() => 'auto'}
        />
      </Paper>

      {selectedStock && (
        <Paper
          sx={{
            height: 400,
            p: 2,
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedStock.symbol} - Price History
            </Typography>
            <IconButton
              onClick={() => setSelectedStock(null)}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <LineChart
            series={[
              {
                type: 'line',
                data: selectedStock.history.map(
                  (h: { price: number }) => h.price
                ),
                color: selectedStock.change >= 0 ? '#2e7d32' : '#d32f2f',
              },
            ]}
            xAxis={[
              {
                data: selectedStock.history.map(
                  (h: { date: string }) => new Date(h.date)
                ),
                scaleType: 'time',
                valueFormatter: (value: Date) => format(value, 'MM/dd'),
              },
            ]}
            yAxis={[
              {
                min:
                  Math.min(
                    ...selectedStock.history.map(
                      (h: { price: number }) => h.price
                    )
                  ) * 0.99,
                max:
                  Math.max(
                    ...selectedStock.history.map(
                      (h: { price: number }) => h.price
                    )
                  ) * 1.01,
              },
            ]}
            height={300}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          />
        </Paper>
      )}
    </Box>
  )
}

export default StockDashboard
