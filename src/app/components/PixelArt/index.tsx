'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { LicenseInfo } from '@mui/x-license'
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE || '')

import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro'
import {
  Undo,
  Redo,
  Save,
  Delete,
} from '@mui/icons-material'

const GRID_SIZE = 20
const CELL_SIZE = 20

const COLORS = [
  '#000000', 
  '#FFFFFF', 
  '#ffadad', 
  '#ffd6a5', 
  '#fdffb6', 
  '#caffbf', 
  '#9bf6ff', 
  '#a0c4ff', 
  '#bdb2ff', 
  '#ffc6ff', 
  '#e5c185', 
  '#808080', 
]

interface PixelData {
  color: string;
}

export const PixelArtGenerator: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [pixels, setPixels] = useState<{ [key: string]: PixelData }>({})
  const [history, setHistory] = useState<{ [key: string]: PixelData }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const rows = useMemo(() => {
    const result = []
    for (let i = 0; i < GRID_SIZE; i++) {
      result.push({ id: i })
    }
    return result
  }, [])

  const handlePixelClick = useCallback((row: number, col: number) => {
    const pixelKey = `${row}-${col}`
    const newPixels = { ...pixels }
    newPixels[pixelKey] = { color: selectedColor }
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newPixels)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    setPixels(newPixels)
  }, [pixels, selectedColor, history, historyIndex])

  const columns = useMemo<GridColDef[]>(() => {
    const result: GridColDef[] = []
    for (let i = 0; i < GRID_SIZE; i++) {
      result.push({
        field: `col${i}`,
        headerName: '',
        width: CELL_SIZE,
        minWidth: CELL_SIZE,
        maxWidth: CELL_SIZE,
        renderCell: (params: GridRenderCellParams) => {
          const pixelKey = `${params.row.id}-${i}`
          const pixel = pixels[pixelKey]
          
          return (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: pixel?.color || '#FFFFFF',
                border: '1px solid #EAE7EC',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={() => handlePixelClick(params.row.id, i)}
            />
          )
        },
      })
    }
    return result
  }, [pixels, handlePixelClick])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setPixels(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setPixels(history[historyIndex + 1])
    }
  }

  const handleClear = () => {
    setPixels({})
    setHistory([{}])
    setHistoryIndex(0)
  }

  const handleSave = () => {
    const canvas = document.createElement('canvas')
    canvas.width = GRID_SIZE * CELL_SIZE
    canvas.height = GRID_SIZE * CELL_SIZE
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    Object.entries(pixels).forEach(([key, pixel]) => {
      const [row, col] = key.split('-').map(Number)
      ctx.fillStyle = pixel.color
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    })

    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 3,
      maxWidth: '450px',
      mx: 'auto'
    }}>
      <Typography 
        variant="h4"
        sx={{
          mb: 3,
          pl: 1,
          fontWeight: 'bold'
        }}
      >
        Pixel Art Generator
      </Typography>
      <Box sx={{ 
        width: '100%', 
        backgroundColor: '#ffffff',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            flex: 1
          }}>
            {COLORS.map((color) => (
              <Tooltip key={color} title={color}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: color,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: selectedColor === color ? '2px solid #3E63DD' : '2px solid transparent',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ 
            display: 'flex',
            gap: 1
          }}>
            <Tooltip title="Undo">
              <IconButton 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear">
              <IconButton onClick={handleClear}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save as PNG">
              <IconButton onClick={handleSave}>
                <Save />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pb: 2
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: GRID_SIZE * CELL_SIZE,
              maxWidth: '100%',
              mx: 'auto',
            }}
          >
            <DataGridPro
              rows={rows}
              columns={columns}
              hideFooter
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              disableRowSelectionOnClick
              columnHeaderHeight={0}
              rowHeight={CELL_SIZE}
              sx={{
                border: 'none',
                '& .MuiDataGrid-main': {
                  border: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  p: 0,
                  border: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  display: 'none',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
} 