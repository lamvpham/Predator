# Predator

### **Built with [p5.js](https://p5js.org/)**

Based on predator and prey using echolocation - this generative artwork endlessly progresses the piece's story, with the final result of this became the source (predator) chasing the prey using echolocation, like a game of cat and mouse.  

! [Image](image.png)


## Formal Qualities
At the beginning, the predator is closely resembling the colour of the background (the ocean), so it’s lurking and hard to notice unless you look closely. The prey is a bright colour, to show the noticeability of the naive prey. There are two audios incorporated - one where the ‘Jaws’ theme song plays when the boolean variable ‘isChasing’ is active, and the other audio being from the movie ‘Psycho’ once the predator catches the prey. As the predator catches prey, it increases in size and becomes a brighter colour gradually, indicating that as it eats more, it’s easier to spot out.

## Context
This idea was inspired by the concept of predator and prey, where there is a chase between the two. The audios were added to create suspense as the viewer watches the predator detect and go after the prey, similar to a cat and mouse. I wanted the movements of the predator and prey to be smooth and more natural, resembling an animal wandering around, so I used Perlin noise to adjust the x and y movements in very small increments to determine a new direction every time (referenced from an online sketch). Over the course of the simulation, the viewer will see the predator become a bright pink and fill the whole screen, and is intentional to show the process of natural selection with the greed of some animals, causing them to eventually become prey itself due to its noticeability.

## Technical Description
The way I structured my code using p5.js is surrounding the ‘waves’ agent. In that agent file, it defines the initial origin points of the wave being emitted from the predator or prey, the interaction if a wave from the predator hits a prey, and the visuals of the waves. In the main sketch file, the code sets up the predator and prey objects, their movements using Perlin noises, what happens once the predator catches the prey, and the behaviour of the waves. There are additional functions for logistics, like the boundary, windowResized, and mousePressed functions.
