import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DocumentList from './listview';
import { useSnackbar } from 'notistack';
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
    margin: 0
  },

  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    marginRight: "5ch",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(0),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    display: 'none',
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "38ch",
      "&:focus": {
        width: "72ch"
      }
    }
  }
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [documents, setDocuments] = React.useState([]);
  const [tempDocuments, settempDocuments] = React.useState([]);
  //const [images, setImages] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let searchText = "";
  let isLoading = false;

  React.useEffect(() => {
    isLoading = true;
    getDocs('Data fetched successfully!');
  }, []);

//   React.useEffect(() => {
//     if(documents) {
        
//     }
//   }, [documents]);

  
  const getDocs = (successText) => {
    isLoading = true;
    axios
    .get(`http://localhost:5000/getDocs`, {
      params: {
        start: 0,
        size: 25
      }
    })
    .then(({ data }) => {
      settempDocuments(data)
      if (successText)
        enqueueSnackbar(successText, {variant: 'success'});
      
      isLoading = false;
      return data
    })
    .then(tempDocuments => {
        console.log("aaa")
        let i;
        let imagesList = []
        console.log(documents)

        let promises = [];
        for (i = 0; i < tempDocuments.length; i++) {
            promises.push(
                axios.get(`http://localhost:5000/getImage`, {
                                params: {
                                uuid: tempDocuments[i]._source.uuid
                                },responseType: 'blob'
                            }).then(response => {
                // do something with response
                    imagesList.push(URL.createObjectURL(response.data));
                })
            )
        }
        Promise.all(promises).then(() => {
            for (i = 0; i < tempDocuments.length; i++) {
                tempDocuments[i]._id = imagesList[i]
            }
            setDocuments(tempDocuments)
        })

    })
    .catch(err => {
      enqueueSnackbar('Something went wrong while fetching documents. Please refresh.', {variant: 'error'});
      console.log(err);
      isLoading = false;
    })
  }

  let handleUploadClick = (e) => {
      enqueueSnackbar('Uploading Document and Running OCR.', {variant: 'info'});
    
      let formData = new FormData()

      formData.append('file', e.target.files[0])
      isLoading = true;
      axios
      .post(
        `http://localhost:5000/upload`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
      )
      .then(response => {
        console.log(response)
        isLoading = false;
        enqueueSnackbar('Document uploaded successfully!', {variant: 'success'});
        setTimeout(() => {
            getDocs('');
        }, 7000);
        
      })
      .catch(err => {
        console.log(err);
        isLoading = false;
        enqueueSnackbar('Something went wrong. Please try again.', {variant: 'error'});
      })
      
  }

  let searchInputChange = (e) => {
    searchText = e.target.value;
    if(searchText.charAt(searchText.length-1) !== " ") {
        isLoading = true;
        axios
        .get(`http://localhost:5000/search`, {
            params: {
            text: searchText
            }
        })
        .then(({ data }) => {
            settempDocuments(data)
            isLoading = false;
            return data
          })
          .then(tempDocuments => {
              console.log("aaa")
              let i;
              let imagesList = []
              console.log(documents)
      
              let promises = [];
              for (i = 0; i < tempDocuments.length; i++) {
                  promises.push(
                      axios.get(`http://localhost:5000/getImage`, {
                                      params: {
                                      uuid: tempDocuments[i]._source.uuid
                                      },responseType: 'blob'
                                  }).then(response => {
                      // do something with response
                          imagesList.push(URL.createObjectURL(response.data));
                      })
                  )
              }
              Promise.all(promises).then(() => {
                  for (i = 0; i < tempDocuments.length; i++) {
                      tempDocuments[i]._id = imagesList[i]
                  }
                  setDocuments(tempDocuments)
              })
      
          })
        
        .catch(err => {
            console.log(err);
            isLoading = false;
        })
    }
  }
  
  {console.log("just before return", documents)}
  return (
    <div className={classes.root}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            OCR and Grammar Check
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search for any text…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={searchInputChange}
            />
          </div>
          <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={handleUploadClick}
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="secondary" component="span" startIcon={<CloudUploadIcon />}>
                Upload
              </Button>
            </label>
        </Toolbar>
      </AppBar>
      {!isLoading && documents ? (
          
            <DocumentList documents = {documents}/>
        ) : <LinearProgress color="secondary"/>
      }
    </div>
  );
}
