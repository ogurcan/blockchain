pandoc -f markdown_github -t mediawiki Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.md -o Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.wiki
sed -i -e 's/&gt;/>/g' Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.wiki
sed -i -e 's/&quot;/"/g' Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.wiki
sed -i -e 's/<pre class="js">/<source lang="javascript">/g' Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.wiki
sed -i -e 's%</pre>%</source>%g' Setting\ Up\ a\ Local\ Private\ Test\ Network\ with\ One\ Node.wiki
