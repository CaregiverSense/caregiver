/**
 * Created by Tatiana on 11/8/2015.
 */
angular.module("Test", []).
    controller("MmseCtrl", function() {
        var me = this;
        this.userId = req.body.userId;
        this.sections = [
            { title : "Orientation: time", key : "orientation1", max : 5, question : '\"What is the Year Season? Date? Day of the week? Month?\"', instruction : "Ask for the date. Then specifically ask for parts ommitted (e.g., \"Can you also tell me what season it is?\"). One point for each correct answer."},
            { title : "Orientation: location", key : "orientation2", max : 5,question: "\"Where are we now: State? Country? Town/city? Hospital? Floor?\"", instruction : "Ask in turn, \"Can you tell me the name of this hospital (town, country, etc.)?\" One point for each correct answer."},
            { title : "Registration", key : "registration", max : 3, question : "The examiner names three unrelated objects clearly and slowly, then asks the patient name all three of them. The patient\'s response is used for scoring. The examiner repeats them until patient learns all of them, if possible. Number of trials: ___________", instruction : "Say the names of three unrelated objects clearly and slowly, allowing approximately one second for each. After you have sayd all three, ask the patient to repeat them. The number of objects the patient names correctly upon the first repetition determines the score (0-3). If the patient does not repeat all three objects the first time, continue saying the names until the patient is able to repeat all three items, up to six trials. Record the number of trials it takes for the patient to learn the words. If the patient does not eventually learn all three, recall cannot be meaningfully tested. After completing this task, tell the patient, \"Try to remember the words, as I will ask for them in a little while.\"" },
            { title : "Attention and Calculation", key : "attention", max : 5, question : "\"I would like to count backward from 100 by sevents.\" (93,86,79,72,65, ...). Stop after five answers. Alternative: \"Spell WORLD backwards.\" (D-L-R-O-W).", instruction : "Ask the patient to begin with 100 and count backwards by sevens. Stop after five substractions (93, 86, 79, 72, 65). Score the total number of correct answers. If the patient cannot or will not perform the substraction task, ask the patient to spell the word \"world\" backwards. In this case, the score is the number of letters in correct order (e.g., dlrow = 5, dlorw = 3)."},
            { title : "Recall", key : "recall", max : 3, question : "\"Earlier I told you the names of three things. Can you tell me what those were?\"", instruction : "Ask the patient if he or she can recall the three words you previously asked him or her to remember. Score the total number of correct answers (0-3)."},
            { title : "Language and Praxis: naming", key : "language1", max : 2, question : "Show the patient two simple objects, such as a wristwatch and a pencil, and ask the patient to name them.", instruction : "Show the patient a wrist watch and ask the patient what it is. Repeat with the pencil. Score one point for each correct naming (0-2)."},
            { title : "Language and Praxis: repetition", key : "language2", max : 1, question : "\"Repeat the phrase: \'No ifs, ands, or buts.\'\"", instruction : "Ask the patient to repeat the sentence after you (\"No ifs, ands, or buts\"). Allow only one trial. Score 0 or 1."},
            { title : "Language and Praxis: 3-stage command", key : "language3", max : 3, question : "\"Take the paper in your right hand, fold it in half, and put it on the floor.\" (The examiner gives the patient a piece of blank paper.) ", instruction : "Give the patient a piece of blank paper and say, \"Take this paper in your right hand, fold it in half, and put it on the floor.\" Score one point for each part of of the command correctly executed."},
            { title : "Language and Praxis: reading", key : "language4", max : 1, question : "\"Please read this and do what it says.\" (Written instruction is \"Close your eyes\").", instruction : "On a blank piece of paper print the sentence, \"Close your eyes\" in letters large enough for the patient to see clearly. Ask the patient to read the sentence and do what it says. Score one point only if the patient actually closes his or her eyes. This is  not a test of memory, so you may prompt the patient to \"do what it says\" after patient reads the sentence."},
            { title : "Language and Praxis: writing", key : "language5", max : 1, question : "\"Make up and write a sentence about anything.\" (This sentence must contain a noun and a verb).", instruction : "Give the patient a blank piece of paper and ask him or her to write a sentence; it should be written spontaneously. The sentence must contain a subject and a verb and make a sense. Correct grammar and punctuation are not necessary."},
            { title : "Language and Praxis: copying", key : "language6", max : 1, question : "\"Please copy this picture.\" (The examiner gives the patient a blank piece of paper and asks him/her to draw the symbol below. All 10 angles must be present and two must intersect.)", instruction : "Show the patient the picture of two intersecting pentagons and ask the patient to copy the figure exactly as it is. All ten angles must be present and two must intersect to score one point. Ignore tremor and rotation."}
        ];

        this.select = function(testResultKey, val) {
            me.testResults[testResultKey] = val;
        };


        this.testResults = {
            "orientation1" : "",
            "orientation2" : "",
            "registration" : "",
            "attention" : "",
            "recall" : "",
            "language1" : "",
            "language2" : "",
            "language3" : "",
            "language4" : "",
            "language5" : "",
            "language6" : "",
        };

        this.toggleInstructions = function(section) {
            section.showInstructions = !section.showInstructions;
        };

        this.isFilled = function(val) {
            return val !== '';
        }

        this.submit = function() {
            me.testResults["userId"] = me.userId;
            $.post("http://52.88.50.116:7000/mmse",
                me.testResults, function(response) {
                });
        }
    });