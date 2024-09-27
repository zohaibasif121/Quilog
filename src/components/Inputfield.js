import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Inputfield(props) {
  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="on"
    >
      <TextField
        label={props.label}
        variant="outlined"
        value={props.value}
        onChange={props.onChange}
        className={props.className} 
        sx={{ width: '100%' }}
        // {...register(`${props.name}`)} 
        required
      />
    </Box>
  );
}
