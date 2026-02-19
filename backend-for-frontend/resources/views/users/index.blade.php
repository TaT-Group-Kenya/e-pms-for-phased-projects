<!DOCTYPE html>
<html>
<head>
    <title>Students</title>
</head>
<body>

<h2>Students List</h2>

<a href="/students/create">Add Student</a>

<ul>
@foreach($students as $student)
    <li>{{ $student->name }} - {{ $student->email }} - {{ $student->course }}</li>
@endforeach
</ul>

</body>
</html>
