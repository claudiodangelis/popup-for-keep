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
                            var infoNode = doc.querySelector(
                                '[href^="https://accounts.google.com/SignOutOptions"'
                            )
                            var info = infoNode.getAttribute('aria-label');
                            // Get name
                            // TODO: Clean name up
                            name = info
                            // Get email
                            email = info.match(
                                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
                            );
                            if (email.length > 0) {
                              email = email[0]
                            }
                            var imageNode = doc.querySelector(`a[href$="?authuser=${index}"] > img`)
                            if (imageNode !== null) {
                              image = imageNode.getAttribute('data-src')
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
