import React, { useEffect } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import logo from "../logo.svg";

const PdfGenerator = ({ urls, info }) => {
  info.map((order, i) => {
    order.url = urls[i];
  });

  const PdfIdee = () => {
    return (
      <Document>
        {info.map((order, i) => {
          return (
            <Page style={styles.body}>
              <Image style={styles.image} src={order.url} />
              <Text style={styles.title}>Packing List</Text>
              {order.map((item) => {
                if (item.quantity > 1) {
                  return (
                    <Text
                      style={styles.highlight}
                    >{`Quanity: ${item.quantity}, Item: ${item.item_name}`}</Text>
                  );
                } else {
                  return (
                    <Text
                      style={styles.text}
                    >{`Quanity: ${item.quantity}, Item: ${item.item_name}`}</Text>
                  );
                }
              })}
            </Page>
          );
        })}
      </Document>
    );
  };

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontFamily: "Oswald",
      marginBottom: 10,
    },
    highlight: {
      backgroundColor: "yellow",
      color: "red",
      fontSize: 12,
      textAlign: "center",
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 10,
    },
    image: {
      marginVertical: -20,
      marginHorizontal: 100,
      transform: "rotate(90deg)",
    },
  });

  return (
    <PDFDownloadLink document={<PdfIdee />} fileName="somename.pdf">
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download now!"
      }
    </PDFDownloadLink>
  );
};

export default PdfGenerator;
