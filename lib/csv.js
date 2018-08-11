module.exports = {

  arrayToCsv(array) {

    let csv = Object.keys(array[0]).join(',')

    array.forEach(obj => {

      csv += '\n'
      csv += Object.values(obj).join(',')

    })

    return csv

  }

}