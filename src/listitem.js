import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TableView from './tableview';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    margin: '10px 25px 10px 25px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 201,
    height: 201
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  
export default function MediaControlCard(props) {
  const classes = useStyles();

//   const [name, setname] = React.useState("");
//   const [text, settext] = React.useState("");
//   const [uuid, setuuid] = React.useState("");
//   const [image, setimage] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [grammarOpen, setGrammarOpen] = React.useState(false);

  const handleClickOpen = (scrollType) => () =>{
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGrammarClickOpen = () => {
    setGrammarOpen(true);
  };

  const handleGrammarClose = () => {
    setGrammarOpen(false);
  };

//   React.useEffect(() => {
//     setname(props.doc._source.uuid)
//     settext(props.doc._source.ocr_text)
//     setuuid(props.doc._source.uuid)
//     setimage(props.doc.image)

//   }, [])

  const descriptionElementRef = React.useRef(null);

  return (
      <div>
        <Card className={classes.root}>
        <CardMedia
            className={classes.cover}
            component='img'
            src={props.doc.image}
            title="Live from space album cover"
        />
        <div className={classes.details}>
            <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
                {props.doc._source.uuid}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary"> 
            {props.doc._source.ocr_text.length > 200 ? (
                    <span>{props.doc._source.ocr_text.substring(0, 200)}... <a style={{color:'#6200EE', textDecoration:'underline', cursor: 'pointer'}} onClick={handleClickOpen('paper')}>Read more</a></span>
                ): props.doc._source.ocr_text}
            </Typography>
            </CardContent>
            <div className={classes.controls}>
                <Button onClick={handleGrammarClickOpen}size="small" variant="outlined" color="primary">
                    Grammar Check
                </Button>
                <Button onClick={handleClickOpen('paper')} size="small" variant="outlined" color="primary" style={{marginLeft: '10px'}}>
                    Full Text
                </Button>
            </div>
        </div>
        
        </Card>
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Full Text for {props.doc._source.uuid}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                {props.doc._source.ocr_text}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
            </DialogActions>
        </Dialog>


        <Dialog fullScreen open={grammarOpen} onClose={handleGrammarClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleGrammarClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                Grammar Check for {props.doc._source.uuid}
            </Typography>
          </Toolbar>
        </AppBar>
        <TableView uuid={props.doc._source.uuid}/>
      </Dialog>
    </div>
  );
}
