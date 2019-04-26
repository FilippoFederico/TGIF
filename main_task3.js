//document. (".ciao").innerHTML = "!!!!!!!!!!!";
//document.getElementById("vvv").innerHTML = "!!!!!!!!!"
//console.log("ciaooo")

fetch('https://api.propublica.org/congress/v1/113/' + congress + '/members.json', {
        headers: {
            'X-API-Key': 'mGhLOIQKWY6EfJUgpp1eaAnqy1bE08OH0gvvdJvN'
        }


    }) // Call the fetch function passing the url of the API as a parameter

    .then(function (response) {
        return response.json();
        // Your code for handling the data you get from the API
    })
    .then(function (data) {
        var result = data.results[0]
        var membersData = result.members;
        console.log(data)
        console.log(membersData);
        attendeceData(membersData);
        leastEngaged(membersData);
        mostEngaged(membersData);
        //    var sortedMembers = sortMembersByMissedVotes(membersData);
        //    leastEngaged(sortedMembers);
    })
    .catch(err => console.log(err));

var statistic = [{
        Party: "Republican",
        NumberOfReps: 0,
        VotedWithPartyPct: 0,
        value: "R"
},
    {
        Party: "Democratic",
        NumberOfReps: 0,
        VotedWithPartyPct: 0,
        value: "D"
},
    {
        Party: "Indipendent",
        NumberOfReps: 0,
        VotedWithPartyPct: 0,
        value: "I"
},
    {
        Party: "Total",
        NumberOfReps: 0,
        VotedWithPartyPct: 0,
        value: "T"
}]


//----------------------------------------------------------------------




function attendeceData(membersData) {
    var democraticData = 0;
    var republicanData = 0;
    var indipendentData = 0;

    var democraticTotalVotes = 0;
    var republicanTotalVotes = 0;
    var indipendentTotalVotes = 0;


    for (var i = 0; i < membersData.length; i++) {

        if (membersData[i].party === "D") {
            democraticData = democraticData + 1;
            democraticTotalVotes = democraticTotalVotes + membersData[i].total_votes;

        } else if (membersData[i].party === "R") {
            republicanData = republicanData + 1;
            republicanTotalVotes = republicanTotalVotes + membersData[i].total_votes;

        } else if (membersData[i].party === "I") {
            indipendentData = indipendentData + 1;
            indipendentTotalVotes = indipendentTotalVotes + membersData[i].total_votes;
        }
    }

    var totalVotes = republicanTotalVotes + democraticTotalVotes + indipendentTotalVotes;
    for (var y = 0; y < statistic.length; y++) {

        if (statistic[y].value === "D") {
            statistic[y].NumberOfReps = democraticData;
            statistic[y].VotedWithPartyPct = Number((democraticTotalVotes / totalVotes) * 100).toFixed(2);

        } else if (statistic[y].value === "R") {
            statistic[y].NumberOfReps = republicanData;
            statistic[y].VotedWithPartyPct = Number((republicanTotalVotes / totalVotes) * 100).toFixed(2);

        } else if (statistic[y].value === "I") {
            statistic[y].NumberOfReps = indipendentData;
            statistic[y].VotedWithPartyPct = Number((indipendentTotalVotes / totalVotes) * 100).toFixed(2);

        } else {
            statistic[y].NumberOfReps = membersData.length;
            statistic[y].VotedWithPartyPct = Number(((democraticTotalVotes + republicanTotalVotes + indipendentTotalVotes) / totalVotes) * 100).toFixed(2);
        }
    }
    createAttendenceTable();

    mostEngaged(membersData);
}

//----------------------------------------------------------------------


function createAttendenceTable() {
    var mainTr = "";

    for (var y = 0; y < statistic.length; y++) {
        var partyTd = '<td>' + statistic[y].Party + '</td>';
        var NumberOfRepsTd = '<td>' + statistic[y].NumberOfReps + '</td>';
        var VotedWithPartyPctTd = '<td>' + statistic[y].VotedWithPartyPct + '</td>';
        var trElement = '<tr>' + partyTd + NumberOfRepsTd + VotedWithPartyPctTd + '</tr>';
        mainTr = mainTr + trElement;
    }
    document.querySelector("#vvv").innerHTML = mainTr;
}


//----------------------------------------------------------------------

function sortMembersByMissedVotes(membersData) {
    return membersData.sort(function (a, b) {
        return a.last_name - b.last_name;
    });

    console.log(membersData);

}


function leastEngaged(membersData) {

    var sortedMembers = sortMembersByMissedVotes(membersData);
    var mainTr = ''
    var len = sortedMembers.length;


    for (var i = len - 1; i > 0; i--) {

        if (i > len - 1 - Math.round(0.1 * (len)) || (sortedMembers[i - 1].missed_votes === sortedMembers[i].missed_votes)) {

            var fullName = sortedMembers[i].last_name + " " + sortedMembers[i].middle_name + " " + sortedMembers[i].first_name;
            //        console.log(fullName);


            if (sortedMembers[i].middle_name === null) {
                fullName = sortedMembers[i].last_name + " " + sortedMembers[i].first_name
            } else {
                fullName = fullName;
            }
            console.log(fullName)

            var nameTd = '<td>' + fullName + '</td>';
            var noOfMissedVotesTd = '<td>' + sortedMembers[i].missed_votes + '</td>';
            var missedVotesPerct = '<td>' + sortedMembers[i].missed_votes_pct + '</td>';
            var trElem = '<tr>' + nameTd + noOfMissedVotesTd + missedVotesPerct + '</tr>';
            mainTr = mainTr + trElem;
        } else if (sortedMembers[i - 1].missed_votes !== sortedMembers[i].missed_votes) {
            break;


        }

    }
    document.querySelector('#mmm').innerHTML = mainTr;
}

function mostEngaged(membersData) {

    var sortedMembers = sortMembersByMissedVotes(membersData);
    var mainTr = ''
    var len = sortedMembers.length;

    for (var i = 0; i < len; i++) {
        if (i < Math.ceil(0.1 * (len)) || (sortedMembers[i - 1].missed_votes === sortedMembers[i].missed_votes)) {
            var firstName = sortedMembers[i].first_name;
            var middleName = sortedMembers[i].middle_name;
            var lastName = sortedMembers[i].last_name;
            if (middleName == null) {
                var fullName = lastName + ' ' + firstName;
            } else {
                var fullName = lastName + ' ' + middleName + ' ' + firstName;
            }


            var nameTd = '<td>' + fullName + '</td>';
            var noOfMissedVotesTd = '<td>' + sortedMembers[i].missed_votes + '</td>';
            var missedVotesPerct = '<td>' + sortedMembers[i].missed_votes_pct + '</td>';
            var trElem = '<tr>' + nameTd + noOfMissedVotesTd + missedVotesPerct + '</tr>';
        } else if (sortedMembers[i - 1].missed_votes !== sortedMembers[i].missed_votes) {
            break;
        }

        mainTr = mainTr + trElem;
    }

    document.querySelector('#nnn').innerHTML = mainTr;
}


var result = data.results[0]
var membersData = result.members;
console.log("Hello world!");

prova(membersData)

function prova(membersData) {
    var membersData = result.members;
    console.log(membersData[0])
}
