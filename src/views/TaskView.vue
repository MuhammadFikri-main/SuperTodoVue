<template>
  <div class="container mx-auto flex justify-center items-center h-screen">
    <div class="card bg-base-100 w-96 shadow-xl">
      <!-- Card Body -->
      <div class="card-body">
        <!-- Task and Add Button -->
        <div class="flex flex-row items-center gap-2">
          <label class="input input-bordered flex items-center gap-2 grow">
            <input type="text" class="grow" placeholder="Add Task" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </label>
          <button class="btn btn-primary">Add</button>
        </div>

        <div class="mt-4 flex flex-col gap-4">
          <!-- First Checkbox -->
          <div class="form-control flex flex-row items-center gap-2">
            <input type="checkbox" checked="checked" class="checkbox" />
            <p class="text-sm">Check me</p>
            <a class="flex items-center gap-2">
              Stats
              <span class="badge badge-xs badge-info"></span>
            </a>
          </div>

          <!-- Second Checkbox -->
          <div class="form-control flex flex-row items-center gap-2">
            <input type="checkbox" checked="checked" class="checkbox" />
            <p class="text-sm">Check me</p>
            <a class="flex items-center gap-2">
              Stats
              <span class="badge badge-xs badge-info"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
