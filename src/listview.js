import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import CardListItem from "./listitem";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SimpleList(props) {
  const classes = useStyles();
  let documents = null;
//   React.useEffect(() => {
//       setDocuments(props.documents)
//   });
  documents = props.documents
  
  return (
    <div className={classes.root}>
      <List component="listview" aria-label="documents">
        {documents.map((doc) => (
            <CardListItem name={doc._source.uuid} text={doc._source.ocr_text} uuid={doc._source.uuid}/>
        ))}
      </List>
    </div>
  );
}
