# Chain Reaction

Generate a random sequence.
Setup a list of logic rules which amplify any streaks within the sequence.

Weigh the positive amplification of these streaks against a normal rundown via negative streaks.

987654321.123456789

   #
  / \
 /   \
# --- #

## Hypothesis

The CPU jitter observed between process threads, while repeatedly solving the same set of logic, seems to normalize over the duration. This may be due to some kind of thermal "warm-up" on the logic gates tasked for the process.

The question is this: Is there any correlation between the complexity of the calculation, and normalization of jitter over time? Could we use this information to make predictions on recurring functions?

* *HYPOTHESIS:* Number spaces that contain a higher order of patterns, may warm up faster than spaces without.
* If the above is true, then it may be possible to project this information while analyzing much larger number spaces.

## The Test

* Setup the fibloop generator as an engine type in the promise racing template.
* Configure the promise cars to repeatedly solve for 'n' # of loops.
* The # of the car can represent the modulo governing the engine.
* Each modulo represents a number space with an indeterminate set of patterns or meta-patterns.
* The loop generator will run for a given amount of time, and yield back to the lap record when a collision is made.

### The race will execute in the following steps:

* Solve for i index in the fib sequence.
* The range of modulo cars racing is i-1:i.
* Each car is tasked to solve for: a, b, = i, i-1 + i.
* The cars will be tasked to run a certain number of laps.
* After the top [3, 5, 10?] cars finish, the race is over.
* The results for each modulo car is graphed onto a number grid, with gradients representing which cars finished the race, and in what order.

==[ Car %mod% ]================
Place: 1st
Start:
Finish:
Lap Range:
Entropy Score:

-- Top Times --
Color and label times based on unique/repeatability.

-- Lap Metrics --
Mean, Median, Mode, Range.

-- Track Metrics --
Steps, Loops, Tally, Range, Bias.


Workers with full independence in their process.

Promise racing of execution times, filtered through a set of game rules to determine a winning seed.

Seed is used to broadcast to global buffer and, hopefully, connect to a similar
channel.

If seeds are identical, a match is made and channels are transferred.

If seeds are relatively close, the global buffer may use its own set of matchmaking rules to intervene.

Once channels are established, workers can communicate directly, and outside of
the global buffer.

Workers can then combine their rulesets, and generate a shared seed to the global buffer, and this shared seed may connect to other workers, or even other clusters.

Workers may decide for these rulesets to govern their entropy source, and filter the results based on a target value.

## -- Engine --

* Asyncronously race a collection of promise generators.
* Feed the results into a limit function (with an adjustable ruleset?).
* Decide the ruleset for the output (best 3 out of 5 races?).
* Winning generators persist, losers are initialized with new values.
* The selected generators are used to formulate the broadcast channel.

## -- Communication --

* The channel frequency is based on the average output of the selected generators.
* This channel is broadcast to the global worker and listed as public.
* When the global worker receives two requests for the same channel, a handshake is negotiated, and private channels are exchanged.

## -- Bonding --

* Once two workers are bonded by a private channel, they can pool their resources together. This may include entropy sources, rulesets, or both.
* The workers can continue to establish their own channels, while also broadcasting on a shared channel.

## -- Encryption --

> (input) a^2 * b^2 = c^2 (target)
> a + b = c

* Derivative of target is used to generate a unique rule-set of weights and biases. This rule-set is used to derive c from c^2.

* This process will also carry a unique signature in its execution time measured by the frequency and value of output.

* This execution signature is the key to the bonding process, in which the internal key is shared between parties.

* With both keys exchanged, the two parties can then generate their own shared keys, and communicate in private, through the global channel.

## -- Notes --

* Find way to profile CPU jitter and integrate into the key generation process. The key should be a reflection of the number profile selected by the emergent patterns in the jitter.

