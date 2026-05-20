from html.parser import HTMLParser
class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.tags_of_interest = {'admin-dashboard', 'activities-section', 'lessons-manager', 'birthdays-section'}
        self.results = {}
        
    def handle_starttag(self, tag, attrs):
        if tag == 'div':
            attr_dict = dict(attrs)
            div_id = attr_dict.get('id')
            self.stack.append((tag, div_id, self.getpos()[0]))
            
    def handle_endtag(self, tag):
        if tag == 'div' and self.stack:
            popped_tag, div_id, start_line = self.stack.pop()
            if div_id in self.tags_of_interest:
                self.results[div_id] = {'start': start_line, 'end': self.getpos()[0]}
                
parser = MyHTMLParser()
with open('public/admin/index.html', 'r') as f:
    parser.feed(f.read())
print(parser.results)
