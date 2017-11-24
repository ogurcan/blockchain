pandoc -f markdown_github -t mediawiki README.md -o README.wiki
sed -i -e 's/&gt;/>/g' README.wiki
sed -i -e 's/&quot;/"/g' README.wiki
sed -i -e 's/<pre class="js">/<source lang="javascript">/g' README.wiki
sed -i -e 's%</pre>%</source>%g' README.wiki
