import React, { useRef} from 'react';
import html2canvas from 'html2canvas';
import { createMuiTheme, Button, Snackbar, MuiThemeProvider, withStyles, Avatar, AppBar, Toolbar, Typography, makeStyles, Card, List, CardContent, ListItem, ListItemAvatar, ListItemText,  } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/Camera';
import RefreshIcon from '@material-ui/icons/Refresh';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import ShareIcon from '@material-ui/icons/Share';
import quotes from './quotes';

const { detect } = require('detect-browser');
const browser = detect();


const theme =  createMuiTheme({
  palette: {
    type:"dark",
    background: {
      default: "#212121",
      card: "#424242",
    },
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#fdfdfd"
    }
  },
  typography: {
    h1: { fontFamily: "Montserrat"},
    h2: { fontFamily: "Montserrat"},
    h3: { fontFamily: "Montserrat"},
    h4: { fontFamily: "Montserrat"},
    h5: { fontFamily: "Montserrat"},
    h6: { fontFamily: "Montserrat"},
    body1: { fontFamily: "Raleway"},
    body2: { fontFamily: "Raleway"},

  }
});

const useStyles = makeStyles((theme2) => ({
  backdrop : {
    height: '100%',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    background: theme.palette.background.default
  },
  surface : {
    height: '100%',
    width: '100%',
    maxWidth: 800,
    margin: 'auto',
    position: 'relative'
  },
  toolbar: {
    width: '100%',
    maxWidth: 800,
    margin: 'auto', 
  },
  startButton: {
    marginTop: theme.spacing(2)
  },
  title: {
    marginLeft: theme.spacing(1)
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  topOverlay: {
    width: `calc(100% - ${theme.spacing(2) * 2}px)`,
    padding: theme.spacing(2),
    textAlign: 'center',
    background: 'rgba(0,0,0,0.5)'
  },
  bottomOverlay: {
    width: `calc(100% - ${theme.spacing(2) * 2}px)`,
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(12) + (window.innerWidth > 800? 64 : 56),
    textAlign: 'center',
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute', 
    bottom: 0
  },
  clickButton: {
    position: 'absolute',
    bottom: 0,
    marginBottom: theme.spacing(2) + (window.innerWidth > 800? 64 : 56),
    marginLeft: (window.innerWidth > 800? 800/2 - 64/2 : window.innerWidth/2 - 64/2),
    height: 64, 
    width: 64,
    borderRadius: 32,
  },
  shareButton: {
    position: 'absolute',
    bottom: 0,
    marginBottom: theme.spacing(2) + (window.innerWidth > 800? 64 : 56),
    marginLeft: (window.innerWidth > 800? 800/2 - 64/2 : window.innerWidth/2 - 64/2) - 72,
    height: 64, 
    width: 64,
    borderRadius: 32,
  },
}));

export default function App() {
  const classes = useStyles();
  const [cameraValue, setCameraValue] = React.useState(null);
  const [clickedValue, setClickedValue] = React.useState(null);
  const [snackbarValue, setSnackbarValue] = React.useState(null);
  const [quoteValue, setQuoteValue] = React.useState({});

  const videoElement = useRef(null);
  const shareableElement = useRef(null);

  const initializeCamera = () => {
    setCameraValue("initializing");
    try{
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false,  }).then((stream) => {
          videoElement.current.srcObject = stream;
          
          setCameraValue("initialized")
      }).catch(e => {
          setSnackbarValue("Error initializing camera. Please check the permissions and refresh the page");
          setCameraValue("initializeFailed");
      });
    } catch(e){
      setSnackbarValue("Error initializing camera. Please check the permissions and refresh the page");      
      setCameraValue("initializeFailed");
    }
  }

  const getBody = () => {
    if(cameraValue !== 'initialized'){
      return <CardContent>
        <Typography variant="h6">How it works ...</Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: "#B39DDB"}}>1</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Meet a person" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
            <Avatar style={{backgroundColor: "#90CAF9"}}>2</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Click a picture" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: "#C5E1A5"}}>3</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Check if you should discrimiate" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: "#FFF59D"}}>4</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Do as the app says" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: "#FFAB91"}}>5</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Share a screenshot!" />
          </ListItem>

        </List>
        <Button 
          variant="contained" 
          color="primary" 
          className={classes.startButton}
          onClick={() => initializeCamera()}
        >
            <CameraIcon />&nbsp;Let's go
        </Button>
        <br />
        <img style={{marginTop: 12}} src="https://counter1.stat.ovh/private/freecounterstat.php?c=aknyun6692ux4afm1tpwfapub815xxbr" border="0" title="web counters" alt="web counters" />

      </CardContent>
    }
  }

  const getOverlay = () => {
    if(!cameraValue)
      return null;
    if(cameraValue === "initialized" && !clickedValue) {
      return <div className={classes.overlay}>
        <div className={classes.topOverlay}>
          <Typography variant="h6">Click a picture of a person</Typography>
        </div>
        <div className={classes.bottomOverlay}>
          <Typography variant="body1">Click a photo to see if you should discriminate against this person</Typography>
        </div>
      </div>
    }
    if(clickedValue){
      return <div className={classes.overlay}>
        <div className={classes.topOverlay}>
          <Typography variant="h6">Should I discriminate against ...</Typography>
        </div>
        {quoteValue?<div className={classes.bottomOverlay}>
          <Typography variant="body1"><b>{quoteValue.title}</b></Typography>
          <Typography variant="body2"><i>"{quoteValue.text}"</i></Typography>
          <Typography variant="body2">- {quoteValue.author}</Typography>
        </div>: null}

      </div>
    }
  }

  const getButton = () => {
    if(!cameraValue)
      return null;
    if(!clickedValue)
      return <Button onClick={() => {
        setClickedValue("clicked");
        videoElement.current.pause();
        setQuoteValue(quotes[Math.floor(Math.random() * quotes.length)]);
        setSnackbarValue("Spread the message. Share a screenshot!");
      }} className={classes.clickButton} color="primary" variant="contained"><CameraIcon /></Button>
    else {
      return <Button onClick={() => {
        setClickedValue(null);
        videoElement.current.play()
      }} className={classes.clickButton} color="secondary" variant="contained"><RefreshIcon /></Button>

    }   
  }

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.backdrop}>
        <AppBar position="static" className={classes.toolbar}>
          <Toolbar>
            <Avatar src="/logo.png"/>
            <Typography variant="h6" className={classes.title}>
              Should I Discrimiate .org
            </Typography>
          </Toolbar>
        </AppBar>

        <Card square className={classes.surface}>
          {getBody()}
          <div ref={shareableElement}>
            <video playsInline muted autoPlay ref={ videoElement } style={cameraValue === "initialized"? {height: '100%', width: '100%', position: 'absolute', objectFit: 'cover', objectPosition: 'center'} : { height: 1, width: 1, position: 'absolute' }} />
            {getOverlay()}
          </div>
          {getButton()}
        </Card>
      </div>
      <Snackbar message={snackbarValue} open={snackbarValue} onClose={() => setSnackbarValue(null)} autoHideDuration={3000} />
    </MuiThemeProvider>
  );
}
