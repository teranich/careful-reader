<?xml version="1.0"?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:fb="http://www.gribuser.ru/xml/fictionbook/2.0">
    <xsl:output method="text" omit-xml-declaration="yes" indent="no" encoding="UTF-8"/>
<xsl:template match="/*">{<xsl:for-each select="fb:description/fb:title-info">	
    "title": "<xsl:value-of select="fb:book-title" />",
    "genre": "<xsl:value-of select="fb:genre" />",
    "author": {
        "firstName": "<xsl:value-of select="fb:author/fb:first-name" />",
        "lastName": "<xsl:value-of select="fb:author/fb:last-name" />"
    },
    "date": "<xsl:value-of select="fb:date" />",
    "keywords": "<xsl:value-of select="fb:keywords" />",
    "lang": "<xsl:value-of select="fb:lang" />"
</xsl:for-each>}</xsl:template>
</xsl:stylesheet>