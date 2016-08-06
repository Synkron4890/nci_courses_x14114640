<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template match="/">
		<html>
			<head>
				<style>
				  table {
				    border-collapse: collapse;
				  }
				  td, th {
				    border: 1px solid #999;
				    padding: 0.5rem;
				    text-align: left;
				  }
				  th {
				    font-weight: bold;
				  }
			  </style>
			</head>
			<body>
				<table>
					<tr>
						<th>Title</th>
						<th>Level</th>
						<th>Duration</th>
						<th>Apply</th>
					</tr>
					<xsl:for-each select="courses/course">
							<tr>
								<td>
									<xsl:value-of select="title"/>
								</td>
								<td>
									<xsl:value-of select="level"/>
								</td>
								<td>
									<xsl:value-of select="duration"/>
								</td>
								<td>
									<xsl:value-of select="apply"/>
								</td>
							</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>