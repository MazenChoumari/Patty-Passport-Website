<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Patty Passport — Sitemap</title>
<link rel="icon" href="favicon.ico" sizes="any"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&amp;display=swap" rel="stylesheet"/>
<style>
  :root{--ink:#1b1a19;--cream:#f7f3ec;--red:#ec3013;--yel:#f2b30c;--blu:#2b76c9}
  *{box-sizing:border-box}
  body{margin:0;background:var(--cream);color:var(--ink);font:400 15px/1.5 'Archivo',sans-serif}
  header{background:var(--ink);color:var(--cream);padding:36px 24px 30px}
  header .wrap{max-width:920px;margin:0 auto}
  h1{font:800 clamp(28px,5vw,44px)/1.02 'Archivo',sans-serif;letter-spacing:-.03em;margin:0 0 8px}
  header p{margin:0;color:#bab6b6;font:400 13.5px/1.5 'Archivo',sans-serif}
  header p a{color:var(--yel)}
  .wrap{max-width:920px;margin:0 auto;padding:28px 24px 60px}
  .note{background:#fff;border:2px solid var(--ink);padding:14px 18px;font:600 12.5px/1.5 'Archivo',sans-serif;color:#444141;margin-bottom:22px}
  table{width:100%;border-collapse:collapse;background:#fff;border:2px solid var(--ink)}
  th{text-align:left;background:var(--ink);color:var(--cream);font:800 10px/1 'Archivo',sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:12px 14px}
  td{padding:12px 14px;border-top:1px solid rgba(27,26,25,.14);font:400 13px/1.5 'Archivo',sans-serif;vertical-align:top}
  tr:nth-child(even) td{background:rgba(27,26,25,.03)}
  a.loc{color:var(--blu);text-decoration:none;font-weight:600;word-break:break-all}
  a.loc:hover{text-decoration:underline}
  .prio{display:inline-flex;align-items:center;justify-content:center;min-width:38px;padding:3px 7px;background:var(--yel);color:var(--ink);font:800 11px/1 'Archivo',sans-serif}
  .freq{text-transform:uppercase;font:700 10.5px/1 'Archivo',sans-serif;letter-spacing:.06em;color:#7d7979}
  footer{max-width:920px;margin:0 auto;padding:0 24px 50px;font:400 12px/1.5 'Archivo',sans-serif;color:#7d7979}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <h1>XML Sitemap</h1>
    <p>Patty Passport · <xsl:value-of select="count(s:urlset/s:url)"/> pages listed for search engines · see <a href="robots.txt">robots.txt</a></p>
  </div>
</header>
<div class="wrap">
  <div class="note">This is the human-readable view of sitemap.xml, rendered by an attached XSL stylesheet. The underlying file is still plain, valid sitemap XML — this styling only changes how it looks in a browser.</div>
  <table>
    <tr><th>Page</th><th>Last modified</th><th>Change frequency</th><th>Priority</th></tr>
    <xsl:for-each select="s:urlset/s:url">
      <xsl:sort select="s:priority" order="descending"/>
      <tr>
        <td><a class="loc" href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
        <td><xsl:value-of select="s:lastmod"/></td>
        <td><span class="freq"><xsl:value-of select="s:changefreq"/></span></td>
        <td><span class="prio"><xsl:value-of select="s:priority"/></span></td>
      </tr>
    </xsl:for-each>
  </table>
</div>
<footer>Generated for search engine discovery — this page itself is not indexed.</footer>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
