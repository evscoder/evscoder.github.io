const fetchTimeOfDay = async (link = 'https://worldtimeapi.org/api/ip') => {
    if (!link) {
        throw new Error('The \'link\' arguments are not defined');
    }

    const response = await fetch(link, {
        method: 'GET'
    });

    const result = await response.json();

    return result;
};

export {
    fetchTimeOfDay
};
