let values = [];
let states = [];
let w = 10;  // Width of the bars
let currentSort = 'QuickSort';  // Default sort
let totalValues;
let sorting = false;
let paused = true;
let delay = 10;  // Delay in milliseconds
let canvas = null;

function changeDelay() {
    let slider = document.getElementById('delaySlider');
    let delayValue = document.getElementById('delayValue');
    delay = slider.value;  // Update the global delay variable used in your sorting algorithms
    delayValue.innerHTML = delay;  // Update the display
}


function setup() {
  canvas = createCanvas(windowWidth * 3 / 4, windowHeight / 2);

  let container = select('#canvasContainer');
  // Attach the canvas to the container element
  canvas.parent(container);

  totalValues = floor(width / w);
  resetArray();
  noLoop();
}

function clearValandStates() {
    values = new Array(totalValues);
    for (let i = 0; i < values.length; i++) {
      values[i] = random(height);
      states[i] = -1;
    }
}

function resetArray() {
    clearValandStates();
    noLoop();
    sorting = false;
    paused = true;
    clearValandStates();
    redraw();
  }

function draw() {
  background(0);
  for (let i = 0; i < values.length; i++) {
    stroke(0);
    fill(255);
    if (states[i] == 0) {
      fill('#E0777D');  // Red for active elements
    } else if (states[i] == 1) {
      fill('#D6FFB7');  // Green for sorted elements
    }
    rect(i * w, height - values[i], w, values[i]);
  }
}

function startSorting() {
    if (!sorting) {
      sorting = true;
      paused = false;
      loop();  // Resume drawing
      switch (currentSort) {
        case 'QuickSort':
          quickSort(values, 0, values.length - 1).then(() => {
            sorting = false;
            noLoop();
          });
          break;
        case 'MergeSort':
          mergeSort(values, 0, values.length - 1).then(() => {
            sorting = false;
            noLoop();
          });
          break;
        case 'InsertionSort':
          insertionSort(values).then(() => {
            sorting = false;
            noLoop();
          });
          break;
        case 'HeapSort':
            heapSort(values).then(() => {
                sorting = false;
                noLoop();
            });
            break;
        case 'BubbleSort':
            bubbleSort(values).then(() => {
                sorting = false;
                noLoop();
            });
            break;
        case 'SelectionSort':
            selectionSort(values).then(() => {
                sorting = false;
                noLoop();
            });
            break;
        case 'RadixSort':
            radixSort(values).then(() => {
                sorting = false;
                noLoop();
            });
            break;
      }
    }
  }

  function pauseSorting() {
    if (sorting && !paused) {
        noLoop();
        paused = true;
    }
  }
  
  function changeAlgorithm(algo) {
    console.log(sorting, paused);
    if(!sorting) {
        currentSort = algo;
        resetArray();
        updateExplanation(currentSort);  // Update the text based on the selected algorithm
        // remove active class from the current button, and add it to the new button
        let currentActive = select('.active');
        currentActive.removeClass('active');
        let newActive = select(`#${algo}`);
        newActive.addClass('active');
    }
    else {
        alert('Please wait for the current sorting to finish!');
    }
    
  }

  async function swap(arr, a, b, slowDownMultiplier = 1) {
    await sleep(delay * slowDownMultiplier);
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  }

// MERGE SORT
async function mergeSort(arr, l, r) {
    if(paused) {
        clearValandStates();
        return;
    }
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  }
  
  async function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);
  
    for (let i = 0; i < n1; i++) {
      L[i] = arr[l + i];
      states[l + i] = 0; // Active state
    }
    for (let j = 0; j < n2; j++) {
      R[j] = arr[m + 1 + j];
      states[m + 1 + j] = 0; // Active state
    }
  
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      states[k] = 1; // Sorted state
      await sleep(delay);
      k++;
    }
  
    while (i < n1) {
      arr[k] = L[i];
      states[k] = 1; // Sorted state
      i++;
      k++;
      await sleep(delay);
    }
  
    while (j < n2) {
      arr[k] = R[j];
      states[k] = 1; // Sorted state
      j++;
      k++;
      await sleep(delay);
    }
  }

// INSERTION SORT
async function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      states[i] = 0; // Mark the key as active
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        states[j + 1] = 0; // Active state for shifting elements
        await sleep(delay * 0.5);
        j = j - 1;
      }
      arr[j + 1] = key;
      for (let k = 0; k <= i; k++) {
        states[k] = 1; // Sorted state up to the current index
      }
      if (paused) {
        clearValandStates();
        return;
      }
    }
  }
  

// QUICK SORT   
async function quickSort(arr, start, end) {
    if (start >= end) {
      return;
    }
    let index = await partition(arr, start, end);
    states[index] = -1;
    if (paused) {
      clearValandStates();
      return;
    }
    await Promise.all([
      quickSort(arr, start, index - 1),
      quickSort(arr, index + 1, end)
    ]);
  }
  
  async function partition(arr, start, end) {
    for (let i = start; i < end; i++) {
      states[i] = 1;
    }
    let pivotValue = arr[end];
    let pivotIndex = start;
    states[pivotIndex] = 0;
    for (let i = start; i < end; i++) {
      if (arr[i] < pivotValue) {
        await swap(arr, i, pivotIndex, 3);
        states[pivotIndex] = -1;
        pivotIndex++;
        states[pivotIndex] = 0;
      }
    }
    await swap(arr, pivotIndex, end, 3);
    for (let i = start; i < end; i++) {
      if (i != pivotIndex) {
        states[i] = -1;
      }
    }
    return pivotIndex;
  }

  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
// HEAP SORT
async function heapSort(arr) {
    let n = arr.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        await swap(arr, 0, i, 2);
        states[i] = 1; // Mark as sorted
        // call max heapify on the reduced heap
        await heapify(arr, i, 0);
        if (paused) {
            clearValandStates();
            return;
        }
    }
    states[0] = 1; // Sort the last element
}

async function heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    states[i] = 0; // Mark as active

    // If left child is larger than root
    if (l < n && arr[l] > arr[largest]) {
        largest = l;
    }

    // If right child is larger than largest so far
    if (r < n && arr[r] > arr[largest]) {
        largest = r;
    }

    // If largest is not root
    if (largest != i) {
        await swap(arr, i, largest);
        // Recursively heapify the affected sub-tree
        await heapify(arr, n, largest);
    }
    states[i] = -1; // Reset state
}

// BUBBLE SORT
async function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (paused) {
                clearValandStates();
                return;
            }
            states[j] = 0; // Mark as active
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1, 0.25);
            }
            states[j] = -1; // Reset state
        }
        states[n - i - 1] = 1; // Mark as sorted
    }
}

// SELECTION SORT
async function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            states[j] = 0; // Mark as active
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
            await sleep(delay * 0.2); // To visualize comparison
            states[j] = -1; // Reset state
        }
        await swap(arr, min_idx, i, 0.2);
        states[i] = 1; // Mark as sorted
        if (paused) {
            clearValandStates();
            return;
        }
    }
    states[n - 1] = 1; // Sort the last element
}

// RADIX SORT
async function radixSort(arr) {
    const maxNum = Math.max(...arr) * 10;
    let digitPlace = 1;

    while (digitPlace < maxNum) {
        const buckets = [...Array(10)].map(() => []);
        for (let i = 0; i < arr.length; i++) {
            const digit = Math.floor((arr[i] / digitPlace) % 10);
            buckets[digit].push(arr[i]);
            states[i] = 0; // Mark as active
            await sleep(delay);
            states[i] = -1; // Reset state
        }

        // Collect the numbers back into arr[]
        let idx = 0;
        for (let b = 0; b < 10; b++) {
            for (let i = 0; i < buckets[b].length; i++) {
                arr[idx] = buckets[b][i];
                states[idx] = 1; // Mark as sorted for visualization
                idx++;
            }
        }
        if (paused) {
            clearValandStates();
            return;
        }
        digitPlace *= 10;
        await sleep(delay);
    }
}
