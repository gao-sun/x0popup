gzip -kv dist/x0popup.min.js
gzip -kv dist/x0popup.min.css
ls -l dist/*.gz | awk '{total += $5} END {print "Total:", total}'
rm dist/x0popup.min.js.gz
rm dist/x0popup.min.css.gz