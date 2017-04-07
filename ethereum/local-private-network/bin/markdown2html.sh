pandoc -f markdown_github README.md -s --toc --highlight-style tango -o index.html
sed -i -e 's/&gt;/>/g' index.html
sed -i -e 's/&quot;/"/g' index.html
sed -i -e 's/<pre class="js">/<source lang="javascript">/g' index.html
sed -i -e 's%</pre>%</source>%g' index.html
