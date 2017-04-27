var Account = {
    getAll: function (callback) {
        // We fetch this URL pattern to discover accounts:
        //      https://keep.google.com/u/:index/
        // where :index is an incremental number starting from 0. The first
        // undefined :index redirects to /0, meaning that `:index -1` accounts
        // were found.
        var xhr, doc, parser, users = [], index = 0;
        var discoverNext = function () {
            xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://keep.google.com/u/' + index + '/', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.status === 200) {
                        // Check if the response URL is consistent to what we
                        // expect it to be. Should end with `index + '/'`
                        if (xhr.responseURL.split('/')[4] === index.toString()) {
                            // Found
                            // Grab data
                            parser = new DOMParser();
                            doc = parser.parseFromString(
                                xhr.responseText, 'text/html'
                            );
                            var name = 'unknown';
                            var email = 'unknown';
                            var image = '';
                            // TODO: Keep selectors separated
                            var nameNode = doc.querySelector('.gb_jb .gb_pb');
                            var emailNode = doc.querySelector('.gb_jb .gb_qb');
                            var imageNode = doc.querySelector('style');
                            if (nameNode !== null) {
                                name = nameNode.textContent;
                            }
                            if (emailNode !== null) {
                                email = emailNode.textContent;
                            }
                            if (imageNode !== null) {
                                var r = new RegExp(/\/\/[a-zA-Z\.0-9\/-]+photo\.jpg/g);
                                console.debug('img', imageNode.innerHTML.match(r));
                                var foundImages = imageNode.innerHTML.match(r);
                                if (foundImages !== null) {
                                    // Take the second found, 96x96
                                    image = 'https:' + foundImages[1];
                                }
                            }
                            users.push({
                                index: index,
                                name: name,
                                email: email,
                                image: image
                            });
                            index++;
                            return discoverNext();
                        } else {
                            // Not found
                            return callback(null, users);
                        }
                    }
                }
            };
            xhr.send();
        };
        discoverNext();
    }
};
