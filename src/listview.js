import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CardListItem from "./listitem";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SimpleList(props) {
  const classes = useStyles();
        
  return (
    <div className={classes.root}>
       
      <List component="nav" aria-label="documents">
        {props.documents.map((doc) => (
            <CardListItem doc={doc}/>
        ))}
      </List>

    </div>
  );
}
