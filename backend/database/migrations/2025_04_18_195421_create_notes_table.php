<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger(('student_id'));
            $table->unsignedBigInteger('course_id');
            $table->integer('unit_number');
            $table->string('lesson_title');
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->unsignedBigInteger('folder_id')->nullable();
            $table->softDeletes();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->timestamps();

            $table->foreign('folder_id')->references('id')->on('folders')->onDelete('set null');
            $table->index(['student_id', 'course_id'], 'idx_student_course');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
