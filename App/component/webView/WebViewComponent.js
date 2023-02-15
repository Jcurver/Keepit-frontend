import React from 'react';
import WebView from "react-native-webview";
import { forwardRef } from 'react';
import customHTML from './customHTML';

export const WebViewComponent = forwardRef({ text, style }, webviewRef) => {
  
  // useMemo로 필요한 경우에만 webview를 리렌더링하게한다.
  const source = useMemo(() => {
    const htmlContent = customHTML;

    let html = htmlContent(injectedJS);
    html = html.replace(/<%text%>/g, text);
    html = html.replace(/<%style%>/g, style);

    return { html };
  }, [js, html, text, style]);
  
  // error발생시 
  const errorHandler = ({ nativeEvent }) => console.warn("WebView error: ", nativeEvent);

  
  return (
      <WebView
        ref={webviewRef}
        source={source}
        onMessage={onMessageReceive}
        javaScriptEnabled={true}
      onError={errorHandler}
      />
  )
}