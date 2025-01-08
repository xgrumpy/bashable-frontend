from bs4 import BeautifulSoup
from bs4.element import NavigableString
import html

# open html export from Google docs and make it play nice with the react website
FILE = 'TermsandConditionsPrivacyPolicy.html'

with open(FILE, 'r') as f:
    html_content = f.read()

# Remove any CSS styles
soup = BeautifulSoup(html_content, 'html.parser')
for tag in soup.find_all('style'):
    tag.decompose()

# Replace <span class="c10"> with <b>
for tag in soup.find_all('span', {'class': 'c0'}):
    b_tag = soup.new_tag('b')
    b_tag.string = tag.string
    tag.replace_with(b_tag)

# Find all the OL tags and delete the start attribute from each one
for ol_tag in soup.find_all('ol'):
    del ol_tag['start']

# Find all occurrences of curly quotes and replace them with straight quotes
for tag in soup.find_all(string=True):
    if isinstance(tag, NavigableString):
        tag.replace_with(tag.replace('‘', "'").replace('’', "'").replace('“', '"').replace('”', '"'))

# Find all occurrences of unescaped quotes and replace them with escaped quotes
for tag in soup.find_all(string=True):
    if isinstance(tag, NavigableString):
        tag.replace_with(html.escape(tag, quote=True))

# add spaces to blank lines to preserve spacing, do this after html escaping
for tag in soup.find_all(['span']):
    if not tag.contents:
        tag.append(NavigableString("&nbsp;"))

# Remove all id and class attributes
for tag in soup.find_all():
    tag.attrs = {key: value for key, value in tag.attrs.items() if key not in ('id', 'class')}

# Add className attribute to header tags
for i in range(1, 7):
    header_tag = 'h' + str(i)
    class_name = 'text-' + str(5-i) + 'xl font-medium dark:text-white text-black'
    for tag in soup.find_all(header_tag):
        tag['className'] = class_name

# Format the HTML with line breaks and tabs
formatted_html = soup.body.prettify(formatter=None)
formatted_html = formatted_html[len('<body>\n'): -len('\n</body>')]

# Write the formatted HTML to a file
with open('output.html', 'w') as f:
    f.write(formatted_html)