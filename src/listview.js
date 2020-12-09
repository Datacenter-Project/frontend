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

//   const [documents, setDocuments] = React.useState(null);
//   const [images, setImages] = React.useState(null);

//   React.useEffect(() => {
//     setDocuments(props.documents)
//     setImages(props.images)
//   },[]);

    let documents = []
    let images = []

    documents = props.documents
    images = props.images

    let i,j;
    if (documents && images) {
        for(i = 0; i < images.length; i++) {
            for(j = 0; j < documents.length; j++) {
                if (images[i].uuid === documents[j]._source.uuid) {
                    documents[j].image = images[i].image
                    break
                }
            }
        }
    }
  return (
    <div className={classes.root}>
       {documents && images ? (
      <List component="listview" aria-label="documents">
        {documents.map((doc) => (
            <CardListItem name={doc._source.uuid} text={doc._source.ocr_text} uuid={doc._source.uuid} image={doc.image}/>
        ))}
      </List>
      ) : null}
    </div>
  );
}
