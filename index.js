const quotesEl = document.querySelector('.quotes');
const loader = document.querySelector('.loader');

let currentPage = 1;
const limit = 10;
let total = 0;

const hasMoreQuotes = (page, limit, total) => {
    const startIndex = (page - 1) * limit + 1;
    return total === 0 || startIndex < total;
};


// 1-
const getQuotes = async (page, limit) => {
    const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
    const response = await fetch(API_URL);

    // handle 404
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
    }
    return await response.json();
}

// 2-show the quotes
const showQuotes = (quotes) => {
    quotes.forEach(quote => {
        const quoteEl = document.createElement('blockquote');
        quoteEl.classList.add('quote');

        quoteEl.innerHTML = `
            <span>${quote.id})</span>
            ${quote.quote}
            <footer>${quote.author}</footer>
        `;

        quotesEl.appendChild(quoteEl);
    });
};

const hideLoader = () => {
    loader.classList.remove('show');
};

const showLoader = () => {
    loader.classList.add('show');
};




// 3-load quotes
const loadQuotes = async (page, limit) => {

    // show the loader
    showLoader();

    // 0.5 second later
    setTimeout(async () => {
        try {
            // if having more quotes to fetch
            if (hasMoreQuotes(page, limit, total)) {
                // call the API to get quotes
                const response = await getQuotes(page, limit);
                // show quotes
                showQuotes(response.data);
                // update the total
                total = response.total;
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            hideLoader();
        }
    }, 500);

};

// window.addEventListener('scroll', () => {
//     const {
//         scrollTop,
//         scrollHeight,
//         clientHeight
//     } = document.documentElement;

//     if (scrollTop + clientHeight >= scrollHeight - 5 &&
//         hasMoreQuotes(currentPage, limit, total)) {
//         currentPage++;
//         loadQuotes(currentPage, limit);
//     }
// }, {
//     passive: true
// });

$(document.body).on('touchmove', onScroll); // for mobile
$(window).on('scroll', onScroll);

// callback
function onScroll() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMoreQuotes(currentPage, limit, total)) {
        currentPage++;
        loadQuotes(currentPage, limit);
    }
}

loadQuotes(currentPage, limit);