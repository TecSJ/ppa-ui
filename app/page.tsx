import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';
import AnimatedPaper from './shared/common/Papers/AnimatedPaper';

const fakeData = [
  { id: 1, name: 'Producto A', price: '$20.00', stock: 15 },
  { id: 2, name: 'Producto B', price: '$35.50', stock: 8 },
  { id: 3, name: 'Producto C', price: '$12.99', stock: 25 },
  { id: 4, name: 'Producto D', price: '$55.00', stock: 5 },
  { id: 5, name: 'Producto E', price: '$99.99', stock: 2 },
  { id: 6, name: 'Producto F', price: '$45.00', stock: 10 },
  { id: 7, name: 'Producto G', price: '$75.25', stock: 7 },
  { id: 8, name: 'Producto H', price: '$5.99', stock: 50 },
  { id: 9, name: 'Producto I', price: '$150.00', stock: 3 },
  { id: 10, name: 'Producto J', price: '$89.99', stock: 6 },
  { id: 11, name: 'Producto K', price: '$29.99', stock: 12 },
  { id: 12, name: 'Producto L', price: '$9.99', stock: 30 },
  { id: 13, name: 'Producto M', price: '$60.00', stock: 9 },
  { id: 14, name: 'Producto N', price: '$110.00', stock: 4 },
  { id: 15, name: 'Producto O', price: '$199.99', stock: 1 },
];

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        position: 'fixed',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '100%',
          gap: '20px',
          width: '100%',
        }}
      >
        <AnimatedPaper>
          <Typography variant='h5' className='text-center text-gray-600 mt-2'>
            Este es un ejemplo de Paper animado con MUI y TailwindCSS.
          </Typography>

          {/* Tabla dentro del Paper */}
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fakeData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.stock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AnimatedPaper>
      </Box>
    </Box>
  );
}
