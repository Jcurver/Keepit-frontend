export default (script) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webView</title>
  <style>
	#container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 150px;
		height: 150px;
		border: 1px solid;
	}
	<%style%>
  </style>
</head>
<body>
  <div id="container"><%text%></div>
</body>
</html>
`;
