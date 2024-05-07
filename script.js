function updateExplanation(algo) {
    const explanationText = {
        // QuickSort explanation
      'QuickSort': `
        <h2>QuickSort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Choose a pivot element from the array (typically the last element).</li>
          <li>Partition the array into two halves, placing elements less than the pivot to its left and elements greater than the pivot to its right.</li>
          <li>Recursively apply the same steps to the left and right sub-arrays surrounding the pivot.</li>
          <li>Combine the sorted sub-arrays to form the final sorted array (this step is inherently completed by the structure of the recursion and does not require actual merging).</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> Average case O(n log n), Worst case O(n²).</li>
          <li><strong>Space Complexity:</strong> O(log n) due to recursive stack space.</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Used in systems where average performance matters, such as in database sorting and multimedia applications.</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> Because it sorts in place and has a good average-case time complexity.</li>
          <li><strong>Not Efficient:</strong> Poor choice in worst-case scenarios, where the chosen pivot regularly is an extremum, leading to skewed partitions.</li>
        </ul>
      `,
      // MergeSort explanation
      'MergeSort': `
        <h2>MergeSort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Divide the array into halves until each sub-array contains a single element.</li>
          <li>Repeatedly merge sub-arrays to produce new sorted sub-arrays until there is only one sorted array.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> Always O(n log n).</li>
          <li><strong>Space Complexity:</strong> O(n), due to the temporary arrays used during the merge process.</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Ideal for sorting linked lists, external sorting (like with large files).</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> Always predictable performance, good for worst-case scenarios.</li>
          <li><strong>Not Efficient:</strong> Requires additional space, which can be costly for large data.</li>
        </ul>
      `,
      // HeapSort explanation
      'HeapSort': `
        <h2>HeapSort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Build a max heap from the input data.</li>
          <li>The largest item is stored at the root of the heap. Replace it with the last item of the heap, reducing the size of the heap by 1. Then heapify the root of the tree.</li>
          <li>Repeat the above steps while the size of the heap is greater than 1.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> O(n log n).</li>
          <li><strong>Space Complexity:</strong> O(1) for the in-place version.</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Useful in applications requiring repeatedly removal of the largest (or smallest) element, such as in priority queues.</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> No extra space is needed (in-place), predictable time complexity.</li>
          <li><strong>Not Efficient:</strong> Not stable (does not maintain the relative order of records with equal keys).</li>
        </ul>
      `,
      // BubbleSort explanation
      'BubbleSort': `
        <h2>MergeSort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Compare adjacent elements and swap them if they are in the wrong order.</li>
          <li>Repeat for each pair of adjacent elements, starting from the beginning, until the end of the array is reached.</li>
          <li>Keep repeating the process, reducing the considered length of the array by one each time, until no swaps are needed.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> O(n²).</li>
          <li><strong>Space Complexity:</strong> O(1).</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Educational tool to teach sorting and algorithms, small datasets, or datasets that are already nearly sorted.</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> Simple and does not require additional memory.</li>
          <li><strong>Not Efficient:</strong> Impractical for large datasets due to its high time complexity.</li>
        </ul>
      `,
      // InsertionSort explanation
      'InsertionSort': `
        <h2>InsertionSort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Start from the second element, compare it to the ones before it, and insert it in the correct position.</li>
          <li>Repeat the process for all elements.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> Average and worst-case O(n²), best case O(n) (if the array is already sorted).</li>
          <li><strong>Space Complexity:</strong> O(1).</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Useful for small or nearly sorted datasets, real-time data where elements are continuously added.</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> For small or nearly sorted data.</li>
          <li><strong>Not Efficient:</strong> Poor performance on large, unsorted datasets.</li>
        </ul>
      `,
      // SelectionSort explanation
      'SelectionSort': `
        <h2>Selection Sort</h2>
        <h3>How it works</h3>
        <ol>
            <li>Find the minimum element in the array and swap it with the element at the first position.</li>
            <li>Find the minimum element from the remaining unsorted portion and swap it with the element at the second position.</li>
            <li>Repeat the process for each position in the array until the entire array is sorted.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
            <li><strong>Time Complexity:</strong> O(n²).</li>
            <li><strong>Space Complexity:</strong> O(1).</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
            <li>Teaching purposes, small datasets, when memory write operations are a performance bottleneck.</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
            <li><strong>Efficient:</strong> Simple and uses minimal memory.</li>
            <li><strong>Not Efficient:</strong> Slow for larger arrays due to high time complexity.</li>
        </ul>
        `,
        // RadixSort explanation
        'RadixSort': `
        <h2>Radix Sort</h2>
        <h3>How it works</h3>
        <ol>
          <li>Sort the input numbers digit by digit, starting from the least significant digit to the most significant, using a stable intermediate sorting algorithm (often counting sort).</li>
          <li>After each pass for a digit sort, the array becomes partially sorted according to that digit. Repeat until all digits have been considered.</li>
        </ol>
        <h3>Complexity</h3>
        <ul>
          <li><strong>Time Complexity:</strong> O(d*(n+b)), where d is the number of digits in the numbers, n is the number of elements, and b is the base of the numbering system used.</li>
          <li><strong>Space Complexity:</strong> O(n + b) due to the use of temporary arrays for counting sort.</li>
        </ul>
        <h3>Real-Life Use Cases</h3>
        <ul>
          <li>Useful for sorting large sets of integers, especially when the integers have a fixed size (like phone numbers or fixed-length ID numbers).</li>
        </ul>
        <h3>Efficiency Analysis</h3>
        <ul>
          <li><strong>Efficient:</strong> Fast when the key size is small compared to the number of items, as with sorting phone numbers or other uniformly structured numerical IDs.</li>
          <li><strong>Not Efficient:</strong> Efficiency depends heavily on the digit size and base used; not as effective for sorting strings of varying lengths or non-integer data.</li>
        </ul>
      `,
      
    };
  
    // Use jQuery or plain JavaScript to select the div and update its HTML
    let div = document.getElementById('algorithmExplanation');
    div.innerHTML = explanationText[algo];  // Replace the content with the selected algorithm explanation
  }
  