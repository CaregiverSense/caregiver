angular.module("Test", []).
    controller("MocaCtrl", function() {
        var me = this;

        this.userId = 10; // TODO
        this.sections = [
            { title : "Executive", key : "executive", max : 5, administration : "The examiner instructs the subject: \"Please draw a line, going from a number to a letter in ascending order. Begin here [point to (l)] and draw a line from 1 then to A then to 2 and so on. End here point to (E)].\"", scoring : "Allocate one point if the subject successfully draws the following pattern:  1 - A - 2 - B - 3 - C - 4 - D - 5 - E, without drawing any lines that cross.  Any error that is not immediately self-corrected earns a score of 0."},
            { title : "Naming", key : "naming", max : 3, administration : "Beginning on the left, point to each figure and say: \"Tell me the name of this animal\"", scoring : "One point each is given for the following responses: (1) camel or dromedary, (2) lion, (3) rhinoceros or rhino."},
            { title : "Memory", key : "memory", max : 0, administration : "The examiner reads a list of 5 words at a rate of one per second, giving the following instructions: \"This is a memory test. I am going to read a list of words that you will have to remember now and later on.  Listen carefully.  When I am through, tell me as many words as you can remember. It doesn't matter in what order you say them\".  Mark a check in the allocated space for each word the subject produces on this first trial.  When the subject indicates that (s)he has finished (has recalled all words), or can recall no more words, read the list a second time with the following instructions: \"I am going to read the same list for a second time.  Try to remember and tell me as many words as you can, including words you said the first time.\"  Put a check in the allocated space for each word the subject recalls after the second trial.  At the end of the second trial, inform the subject that (s)he will be asked to recall these words again by saying, \"I will ask you to recall those words again at the end of the test.\"", scoring : "No points are given for Trials One and Two." },
            { title : "Attention - List of Digits", key : "attention1", max : 2, administration : "Forward Digit Span: Give the following instruction: \"I am going to say some numbers and when I am through, repeat them to me exactly as I said them\". Read the five number sequence at a rate of one digit per second.  Backward Digit Span: Give the following instruction: \"Now I am going to say some more numbers, but when I am through you must repeat them to me in the backwards order.\" Read the three number sequence at a rate of one digit per second.", scoring : "Allocate one point for each sequence correctly repeated, (N.B.: the correct response for the backwards trial is 2-4-7)." },
            { title : "Attention - List of Letters", key : "attention2", max : 1, administration : "The examiner reads the list of letters at a rate of one per second, after giving the following instruction: \"I am going to read a sequence of letters. Every time I say the letter A, tap your hand once. If I say a dffirent letter, do not tap your hand\"", scoring : "Give one point if there is zero to one errors (an error is a tap on a wrong letter or a failure to tap on letter A)."},
            { title : "Attention - Serial Subtraction", key : "attention3", max : 3, administration : "The examiner gives the following instruction: \"Now, I will ask you to count by subtracting seven from 100, and then, keep subtracting seven from your answer until I tell you to stop.\" Give this instruction twice if necessary.", scoring : "This item is scored out of 3 points. Give no (0) points for no correct subtractions, 1 point for one correction subtraction, 2 points for two-to-three correct subtractions, and 3 points if the participant successfully makes four or five correct subtractions. Count each correct subtraction of 7 beginning at 100.  Each subtraction is evaluated independently; that is, if the participant responds with an incorrect number but continues to correctly subtract 7 from it, give a point for each correct subtraction, For example, a participant may respond \"92 - 85 - 78 - 7l - 64\" where the \"92\" is incorrect, but all subsequent numbers are subtracted correctly. This is one error and the item would be given a score of 3." },
            { title : "Language - Sentence Repetition", key : "language1", max : 2, administration : "The examiner gives the following instructions: \"I am going to read you a sentence. Repeat it after me, exactly as I say it [pause]:  I only know that John is the one to help today.\"  Following the response, say: \"Now I am going to read you another sentence. Repeat it after me, exactly as I say it [pause]: The cat always hid under the couch when dogs were in the room\"", scoring : "Allocate 1 point for each sentence correctly repeated.  Repetition must be exact.  Be alert for errors that are omissions (e.g., omitting \"only\", \"always\") and substitutions/additions (e.g., \"John is the one who helped today;\" substituting \"hides\" for \"hid\", altering plurals, etc.)."},
            { title : "Language - Verbal Fluency", key : "language2", max : 1, administration : "The examiner gives the following instruction: \"Tell me as many words as you can think of that begin with a certain letter of the alphabet that I will tell you in a moment. You can say any kind of word you want, except for proper nouns (like Bob or Boston), numbers, or words that begin with the same sound but have a different suffix, for example, love, lover, loving.  I will tell you to stop after one minute. Are you ready?  [Pause] Now, tell me as many words as you can think of that begin with the letter F. [time for 60 sec]. Stop.\"", scoring : "Allocate one point if the subject generates 11 words or more in 60 sec. Record the subject's response in the bottom or side margins."},
            { title : "Abstraction", key : "abstraction", max : 2, administration : "The examiner asks the subject to explain what each pair of words has in common, starting with the example: \"Tell me how an orange and a banana are alike\".  If the subject answers in a concrete manner, then say only one additional time: \"Tell me another way in which those items are alike\".  If the subject does not give the appropriate response (fruit), say, \"Yes, and they are also both fruit.\"  Do not give any additional instructions or clarification.  After the practice trial, say: \"Now, tell me how a train and a bicycle are alike\".  Following the response, administer the second trial, saying: \"Now tell me how a ruler and a watch are alike\".  Do not give any additional instructions or prompts.", scoring : "Only the last two item pairs are scored.  Give 1 point to each item pair correctly answered.  The following responses are acceptable:  Train-bicycle: means of transportation, means of travelling, you take trips in both;  Ruler-watch : measuring instruments, used to measure.  The following responses are not acceptable: Train-bicycle: they have wheels; Ruler-watch: they have numbers." },
            { title : "Delayed Recall", key : "delayedRecall", max : 5, administration : "The examiner gives the following instruction: \"I read some words to you earlier, which I asked you to remember. Tell me as many of those words as you can remember.\" Make a check mark for each of the words correctly recalled spontaneously without any cues, in the allocated space.", scoring : "Allocate 1 point for each word recalled freely without any cues." },
            { title : "Orientation", key : "orientation", max : 6, administration : "The examiner gives the following instructions: \"Tell me the date today\".  If the subject does not give a complete answer, then prompt accordingly by saying: \"Tell me the [year, month, exact date, and day of the week].\" Then say: \"Now, tell me the name of this place, and which city it is in.\"", scoring : "Give one point for each item correctly answered.  The subject must tell the exact date and the exact place (name of hospital, clinic, office).  No points are allocated if subject makes an error of one day for the day and date."},
            { title : "Education", key : "education", max : 1, administration : "Ask if they have had fewer than 12 years of formal education.", scoring : "Assign one point if they have had 12 or fewer years of formal education."}
        ];

        this.select = function(testResultKey, val) {
            me.testResults[testResultKey] = val;
        };

        this.range = function(max) {
            var a = [];
            for (var i = 0; i <= max; i++) {
                a.push(i);
            }
            console.log("range: " + JSON.stringify(a));
            return a;
        };

        this.testResults = {
            "executive" : "",
            "naming" : "",
            "memory" : "",
            "attention1" : "",
            "attention2" : "",
            "attention3" : "",
            "language1" : "",
            "language2" : "",
            "abstraction" : "",
            "delayedRecall" : "",
            "orientation" : "",
            "education" : "",
        };

        this.toggleInstructions = function(section, $event) {
            if (!section.showInstructions) {
                section.showInstructions = true;
            } else {
                section.showInstructions = false;
            }
            console.log("oh");
            $event.preventDefault();
        };

        this.isFilled = function(val) {
            return val !== '';
        }

        this.submit = function() {
            me.testResults["userId"] = me.userId;
            $.post("http://52.88.50.116:7000/moca",
                me.testResults, function(response) {
                });
        }
    });