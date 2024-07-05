#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#include "raylib.h"
#include "raymath.h"

const float W = 1200;
const float H = 800;

const float LINE_LENGTH = 1.4;
const float ANGLE_INCREMENT = M_PI / 8.0;

const size_t N = 10000; // Size of the stack

typedef struct {
    char symbol;
    char *expansion;
} Rule;

typedef struct {
    Vector2 position;
    float theta;
} State;

typedef struct {
    State array[N];   
    int top;
} Stack;

Stack new_stack()
{
    Stack stack;
    stack.top = -1;
    return stack;
}

int is_empty(Stack stack)
{
    return stack.top == -1;
}

int is_full(Stack stack)
{
    return stack.top == N - 1;
}

void push(Stack *stack, State pos)
{
    if (is_full(*stack)) {
        fprintf(stderr, "Stack overflow");
    } else {
        stack->array[++stack->top] = pos;
    }
}

State pop(Stack *stack)
{
    if (is_empty(*stack)) {
        fprintf(stderr, "Stack underflow");
        return (State) {{0.0, 0.0}, 0.0};
    } else {
        return stack->array[stack->top--];
    }
}

void print_stack(Stack stack) {
    for (int i = stack.top; i >= 0; i--) {
        printf("%d: [x: %f, y: %f, r: %f]\n", i, stack.array[i].position.x, stack.array[i].position.y, stack.array[i].theta);
    }
}

State draw_line(Stack stack, State cur_state)
{
    State new_state = cur_state;
    new_state.position.x += LINE_LENGTH * cosf(cur_state.theta);
    new_state.position.y -= LINE_LENGTH * sinf(cur_state.theta); // Subtract because of raylib coordinates

    DrawLine(cur_state.position.x, cur_state.position.y, new_state.position.x, new_state.position.y, WHITE);

    return new_state;
}

State rotate_left(Stack stack, State cur_state)
{
    State new_state = cur_state;
    new_state.theta += ANGLE_INCREMENT;
    return new_state;
}

State rotate_right(Stack stack, State cur_state)
{
    State new_state = cur_state;
    new_state.theta -= ANGLE_INCREMENT;
    return new_state;
}

// This calls the correct functions to draw a single seed
void draw(char *seed, Stack *stack)
{
    State pos = stack->array[stack->top];
    for (char *c = seed; *c; c++) {
        switch (*c) {
            default: break;
            case 'F':
                pos = draw_line(*stack, pos);
                break;
            case '+':
                pos = rotate_left(*stack, pos);
                break;
            case '-':
                pos = rotate_right(*stack, pos);
                break;
            case '[':
                push(stack, pos);
                break;
            case ']':
                pos = pop(stack);
                break;
        }
    }
}

// Return the next seed
char *update(char *seed, Stack *stack, Rule *rules)
{
    char *new_seed = (char *) calloc(1, sizeof(char));

    for (char *c = seed; *c; c++) {
        size_t i = 0;
        while (rules[i].symbol != *c) i++;
        new_seed = (char *) realloc(new_seed, strlen(new_seed) + strlen(rules[i].expansion) + 1);
        strcat(new_seed, rules[i].expansion);
    }

    return new_seed;
}

int main()
{
    // NOTE: A rule must be defined for ALL symbols
    Rule rules[] = {
        {'F', "FF"},
        {'X', "F[+X]F[-X]+X"},
        {'+', "+"},
        {'-', "-"},
        {'[', "["},
        {']', "]"},
    };

    // char *seed = "F+F[F]--F[+F]--F[++F]--F";
    char *seed = "X";
    Stack stack = new_stack();
    push(&stack, (State) {{W/2.0, H - H/12.0}, M_PI/2.0}); // Starting position

    InitWindow(W, H, "L-system");

    while (!WindowShouldClose()) {
        BeginDrawing();
            ClearBackground(BLACK);
            draw(seed, &stack);
            if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
                seed = update(seed, &stack, rules);
            }
        EndDrawing();
    }

    return 0;
}
