import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

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
  let name = props.name
  let text = props.text
  
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


  const descriptionElementRef = React.useRef(null);

  return (
      <div>
        <Card className={classes.root}>
        <CardMedia
            className={classes.cover}
            image="https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg"
            title="Live from space album cover"
        />
        <div className={classes.details}>
            <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
                {name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary"> 
            {text.length > 200 ? (
                    <span>{text.substring(0, 200)}... <a style={{color:'#6200EE', textDecoration:'underline', cursor: 'pointer'}} onClick={handleClickOpen('paper')}>Read more</a></span>
                ): text}
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
            <DialogTitle id="scroll-dialog-title">Full Text for {name}</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                {text}
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
                Grammar Check for {name}
            </Typography>
          </Toolbar>
        </AppBar>
        
      </Dialog>
    </div>
  );
}
