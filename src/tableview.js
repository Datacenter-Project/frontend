import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from "axios";
import { useSnackbar } from 'notistack';

const columns = [
  { label: 'Erroneous Sentence', id: 'errorneous_sentence', minWidth: 170 },
  { label: 'Error Detected', id: 'error_detected', minWidth: 100 },
  {
    label: 'Additional Info',
    id: 'additional_info',
    minWidth: 170,
  },
  {
    label: 'Error Word/Phrase',
    id: 'error_word_phrase',
    minWidth: 170,
  },
  {
    label: 'Possible Replacements',
    id: 'possible_replacements',
    minWidth: 170,
  },
];

function createData(errorneous_sentence, error_detected, additional_info, error_word_phrase, possible_replacements) {
  return { errorneous_sentence, error_detected, additional_info, error_word_phrase, possible_replacements };
}

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  container: {
    maxHeight: '900px',
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  let isLoading = false;
  const [results, setResults] = React.useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    checkGrammar(props.uuid)
  },[]);
  
  let checkGrammar = (uuid) => {
    isLoading = true;
    axios
        .get(`http://35.239.61.25:5000/grammar`, {
            params: {
                uuid: uuid
            }
        })
        .then(({ data }) => {
            console.log(data)

            let rows = []
            let i,j;
            for (i = 0; i < data.length; i++) {
                let possible_replacements = ""
                if (data[i].replacements) {
                    for (j = 0; j < data[i].replacements.length - 1; j++) {
                        possible_replacements += data[i].replacements[j].value + ", "
                    }
                    possible_replacements += data[i].replacements[j].value
                }
                let offset = data[i].context.offset
                let length = data[i].context.length
                let incorrect_word = data[i].context.text.substr(offset, length)
                rows.push(createData(data[i].sentence, data[i].shortMessage, data[i].message, incorrect_word, possible_replacements))
            } 
            setResults(rows)
            isLoading = false;
            enqueueSnackbar('Grammar Check Successful!', {variant: 'success'});
        })
        .catch(err => {
            console.log(err);
            isLoading = false;
            enqueueSnackbar('Something went wrong while fetching documents. Please refresh.', {variant: 'error'});
        })
  }

  return (
    
    <Paper className={classes.root}>
        {!isLoading && results? (
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((row) => {
                    return (
                        <TableRow hover tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                            <TableCell key={column.id} align={column.align}>
                                {value}
                            </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            ) : <LinearProgress color="secondary"/>
        }
    </Paper>
    
  );
}
