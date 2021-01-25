import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import logo from '../logo.svg'

// Create Document Component
const PdfGenerator = ({todo, todoInfo}) => {
  console.log(todo.length)
  console.log(todoInfo)

  const Quixote = () => {
    return (
      <Document>
          {todo.map((img, i) => {
            return (
              <Page style={styles.body}>
              <Image
                style={styles.image}
                src={todo[i]}
              />
              <Text style={styles.author}>Miguel de Cervantes</Text>
              <Text style={styles.author}>Miguel de Cervantes</Text>
              </Page>
            )
          })}
      </Document>
    )
  };
  
  Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });
  
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Oswald'
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
      transform: 'rotate(90deg)'
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });


return (
      <PDFDownloadLink document={<Quixote />} fileName="somename.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
      </PDFDownloadLink>
);
}

export default PdfGenerator